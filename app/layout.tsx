import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';

import '@/app/globals.css';
import { fetchIntroContentValue, parseCmsBoolean } from '@/lib/content';
import { createSupabaseServerClient } from '@/lib/supabase';

const a2jiDisplay = localFont({
  src: './fonts/a2ji-extrabold.woff2',
  variable: '--font-display',
  display: 'swap',
});

const a2jiStrong = localFont({
  src: './fonts/a2ji-bold.woff2',
  variable: '--font-strong',
  display: 'swap',
});

const a2jiBody = localFont({
  src: './fonts/a2ji-light.woff2',
  variable: '--font-body',
  display: 'swap',
});

const title = '추구미 여행 MBTI — 되고 싶은 나의 여행자 유형은?';
const description =
  '나의 MBTI는 이미 알고 있잖아요. 여행할 때 되고 싶은 나의 MBTI는? 12개 여행 상황으로 알아보는 추구미 여행자 유형 테스트.';

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  keywords: ['추구미', 'MBTI', '여행', '유형테스트', '성격테스트', '추구미MBTI'],
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'ko_KR',
    images: ['/og-default.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-default.svg'],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const kakaoJavascriptKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  const supabase = createSupabaseServerClient();
  let adsEnabledValue = 'false';

  if (supabase) {
    try {
      adsEnabledValue = await fetchIntroContentValue(supabase, 'adsEnabled');
    } catch {
      adsEnabledValue = 'false';
    }
  }

  const adsEnabled = parseCmsBoolean(adsEnabledValue, false);

  return (
    <html lang="ko" className={`${a2jiDisplay.variable} ${a2jiStrong.variable} ${a2jiBody.variable}`}>
      <body className="font-body antialiased">
        {adsenseClient && adsEnabled ? (
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          />
        ) : null}
        {kakaoJavascriptKey ? (
          <Script
            id="kakao-js-sdk"
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.0/kakao.min.js"
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
