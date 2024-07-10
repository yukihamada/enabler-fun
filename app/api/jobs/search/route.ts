
import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

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

let query = supabase
      .from('jobs')
      .select('*')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .limit(pageSize);

    if (industry) {
      query = query.eq('industry', industry);
    }
    if (location) {
      query = query.eq('location', location);
    }
    if (salaryMin) {
      query = query.gte('salary', parseInt(salaryMin, 10));
    }
    if (pageToken) {
      query = query.gt('id', pageToken);
    }

    const { data: jobs, error } = await query;

    if (error) {
      throw error;
    }

    const nextPageToken = jobs.length === pageSize ? jobs[jobs.length - 1].id : null;

    return NextResponse.json({
      jobs,
      nextPageToken
    });
  } catch (error) {
console.error('情報の検索中にエラーが発生しました:', error);
return NextResponse.json({ error: '情報の検索中にエラーが発生しました。' }, { status: 500 });
  }
}
