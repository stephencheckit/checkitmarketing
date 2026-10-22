import { NextRequest } from 'next/server';
import { handleDeckLogin } from '@/lib/deck-auth';

export async function POST(req: NextRequest) {
  return handleDeckLogin(req, { cookie: 'deck_sdr_baseline', password: process.env.DECK_SDR_BASELINE_PASSWORD, path: '/sdr-baseline' });
}
