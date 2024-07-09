import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limitValue = limitParam ? parseInt(limitParam, 10) : 100;

    const jobsCollection = collection(db, 'jobs');
    const q = query(jobsCollection, limit(limitValue));
    const querySnapshot = await getDocs(q);

    const jobs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('求人情報の取得中にエラーが発生しました:', error);
    return NextResponse.json({ error: '求人情報の取得中にエラーが発生しました。' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const jobData = await request.json();
    
    // 必須項目の検証
    const requiredFields = [
      'shop_name', 'job_title', 'job_description', 'location', 'industry',
      'salary', 'working_hours', 'requirements', 'customer_unit_price',
      'seats', 'smoking_info', 'nearest_station', 'holidays', 'company',
      'days_off', 'benefits', 'ideal_candidate', 'skills_to_acquire'
    ];

    for (const field of requiredFields) {
      if (!jobData[field]) {
        return NextResponse.json({ error: `${field} は必須項目です。` }, { status: 400 });
      }
    }

    // Firestoreに求人情報を追加
    const jobsCollection = collection(db, 'jobs');
    const docRef = await addDoc(jobsCollection, jobData);

    // 追加された求人情報のURLを生成
    const jobUrl = `https://chef-career.jp/jobs/${docRef.id}`;

    return NextResponse.json({ message: '求人情報が正常に登録されました。', url: jobUrl }, { status: 201 });
  } catch (error) {
    console.error('求人情報の登録中にエラーが発生しました:', error);
    return NextResponse.json({ error: '求人情報の登録中にエラーが発生しました。' }, { status: 500 });
  }
}