import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: '検索クエリが必要です' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&iar=images&iax=images`,
      { 
        headers: { 'Accept': 'application/json' },
        mode: 'no-cors'
      }
    )

    if (!response.ok) {
      throw new Error('画像の検索に失敗しました')
    }

    const data = await response.json()
    const images = data.results?.map((item: any) => item.image) || []

    console.log('検索結果:', images) // デバッグ用

    return NextResponse.json({ images })
  } catch (error) {
    console.error('画像検索エラー:', error)
    return NextResponse.json({ error: '画像の検索中にエラーが発生しました' }, { status: 500 })
  }
}