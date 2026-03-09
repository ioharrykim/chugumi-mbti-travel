'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdBanner({ slot, enabled = true }: { slot: string; enabled?: boolean }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!enabled || !client) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore duplicate push failures during local refresh.
    }
  }, [client, enabled, slot]);

  if (!enabled) {
    return null;
  }

  if (!client) {
    return (
      <div className="ad-shell rounded-[28px] px-5 py-6 text-center">
        <p className="section-kicker justify-center">Monetization Slot</p>
        <p className="mt-3 font-display text-2xl text-[var(--color-ink)]">광고 영역 {slot}</p>
        <p className="mt-2 font-body text-sm leading-6 text-[rgba(16,21,47,0.62)]">
          AdSense 승인 후 이 자리에 결과 기반 자동 광고를 연결하면 됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="ad-shell rounded-[28px] p-3 shadow-[0_12px_30px_rgba(16,21,47,0.08)]">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
