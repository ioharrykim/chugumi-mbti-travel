import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import { DEFAULT_RESULT_TYPES } from '@/lib/constants';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const actual = (searchParams.get('actual') ?? 'INFP').toUpperCase();
  const chugumi = (searchParams.get('chugumi') ?? 'ENTJ').toUpperCase();
  const result = DEFAULT_RESULT_TYPES.find((item) => item.mbti_code === chugumi) ?? DEFAULT_RESULT_TYPES[0];

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: '54px',
          background: 'linear-gradient(160deg, #FFF9F0 0%, #FFECD2 30%, #FCE4EC 60%, #E8EAF6 100%)',
          color: '#1A1A2E',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            borderRadius: 36,
            padding: 42,
            background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 18px 60px rgba(26,26,46,0.14)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 34, fontWeight: 700, color: '#5C6BC0' }}>MBTI TRAVEL TYPE</span>
              <span style={{ fontSize: 82, fontWeight: 900 }}>추구미 여행</span>
              <span style={{ fontSize: 32, color: '#FF7043', fontWeight: 700 }}>되고 싶은 나의 여행자 유형</span>
            </div>
            <div style={{ display: 'flex', fontSize: 120 }}>{result.emoji}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <span style={{ fontSize: 84, fontWeight: 900, color: '#5C6BC0' }}>{chugumi}</span>
              <span style={{ fontSize: 42, fontWeight: 800 }}>{result.title}</span>
            </div>
            <span style={{ fontSize: 28, color: '#5B6475' }}>{result.sub}</span>
            <span style={{ fontSize: 30, fontWeight: 700 }}>{`실제 ${actual} → 추구미 ${chugumi}`}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
