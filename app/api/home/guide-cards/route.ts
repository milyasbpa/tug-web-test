import { NextResponse } from 'next/server';

import homeData from '@/features/home/data/data.json';

export async function GET() {
  return NextResponse.json({
    data: homeData.guideCards,
  });
}
