import { NextResponse } from 'next/server';
import ical, { VEvent } from 'node-ical';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Invalid iCal URL' }, { status: 400 });
  }

  try {
    const events = await ical.async.fromURL(url);
    const formattedEvents = Object.values(events)
      .filter((event): event is VEvent => event.type === 'VEVENT')
      .map(event => ({
        start: event.start,
        end: event.end,
        summary: event.summary ? '予約済み' : '空き',
      }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error('Error fetching iCal data:', error);
    return NextResponse.json({ error: 'Failed to fetch iCal data' }, { status: 500 });
  }
}