import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
const { data: jobData, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', params.jobId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: '情報が見つかりません。' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(jobData);
  } catch (error) {
console.error('情報の取得中にエラーが発生しました:', error);
return NextResponse.json({ error: '情報の取得中にエラーが発生しました。' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobData = await request.json();
const { data: updatedJobData, error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', params.jobId)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(updatedJobData);
  } catch (error) {
console.error('情報の更新中にエラーが発生しました:', error);
return NextResponse.json({ error: '情報の更新中にエラーが発生しました。' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', params.jobId);

    if (error) {
      throw error;
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
console.error('情報の削除中にエラーが発生しました:', error);
return NextResponse.json({ error: '情報の削除中にエラーが発生しました。' }, { status: 500 });
  }
}
