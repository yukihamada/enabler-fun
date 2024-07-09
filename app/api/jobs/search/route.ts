
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const location = searchParams.get('location');
    const salaryMin = searchParams.get('salary_min');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';
    const pageSize = parseInt(searchParams.get('page_size') || '10', 10);
    const pageToken = searchParams.get('page_token');

    const jobsCollection = collection(db, 'jobs');
    let q = query(jobsCollection);

    if (industry) {
      q = query(q, where('industry', '==', industry));
    }
    if (location) {
      q = query(q, where('location', '==', location));
    }
    if (salaryMin) {
      q = query(q, where('salary', '>=', parseInt(salaryMin, 10)));
    }

    q = query(q, orderBy(sortBy, sortOrder as 'asc' | 'desc'));

    if (pageToken) {
      q = query(q, startAfter(pageToken));
    }

    q = query(q, limit(pageSize));

    const querySnapshot = await getDocs(q);

    const jobs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const nextPageToken = lastVisible ? lastVisible.id : null;

    return NextResponse.json({
      jobs,
      nextPageToken
    });
  } catch (error) {
    console.error('求人情報の検索中にエラーが発生しました:', error);
    return NextResponse.json({ error: '求人情報の検索中にエラーが発生しました。' }, { status: 500 });
  }
}
