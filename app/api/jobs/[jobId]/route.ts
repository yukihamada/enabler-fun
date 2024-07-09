import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobDoc = doc(db, 'jobs', params.jobId);
    const jobSnapshot = await getDoc(jobDoc);

    if (!jobSnapshot.exists()) {
      return NextResponse.json({ error: '求人が見つかりません。' }, { status: 404 });
    }

    const jobData = {
      id: jobSnapshot.id,
      ...jobSnapshot.data()
    };

    return NextResponse.json(jobData);
  } catch (error) {
    console.error('求人情報の取得中にエラーが発生しました:', error);
    return NextResponse.json({ error: '求人情報の取得中にエラーが発生しました。' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobData = await request.json();
    const jobDoc = doc(db, 'jobs', params.jobId);

    await updateDoc(jobDoc, jobData);

    const updatedJobSnapshot = await getDoc(jobDoc);
    const updatedJobData = {
      id: updatedJobSnapshot.id,
      ...updatedJobSnapshot.data()
    };

    return NextResponse.json(updatedJobData);
  } catch (error) {
    console.error('求人情報の更新中にエラーが発生しました:', error);
    return NextResponse.json({ error: '求人情報の更新中にエラーが発生しました。' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobDoc = doc(db, 'jobs', params.jobId);
    await deleteDoc(jobDoc);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('求人情報の削除中にエラーが発生しました:', error);
    return NextResponse.json({ error: '求人情報の削除中にエラーが発生しました。' }, { status: 500 });
  }
}