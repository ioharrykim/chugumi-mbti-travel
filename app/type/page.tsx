import type { Metadata } from 'next';
import Link from 'next/link';

import { StaticPageShell } from '@/components/ui/StaticPageShell';
import { getDescriptionLead } from '@/lib/result-types';
import { getServerCmsData } from '@/lib/server-cms';
import { getResultTypePath } from '@/lib/site';

export const metadata: Metadata = {
  title: '추구미 여행 MBTI 유형 모아보기',
  description: '16가지 추구미 여행 MBTI 유형을 한 번에 둘러보고, 각 여행자 캐릭터의 특징을 자세히 확인할 수 있습니다.',
};

export default async function ResultTypeIndexPage() {
  const cmsData = await getServerCmsData();

  return (
    <StaticPageShell
      kicker="Travel Archetypes"
      title="추구미 여행 MBTI 유형 모아보기"
      description="검색 유입과 공유 링크를 위해 모든 결과 유형을 고정 페이지로 정리했습니다. 각 유형 페이지는 결과 특징, 해시태그, 설명을 개별 URL로 확인할 수 있습니다."
    >
      <div className="space-y-5">
        <div className="glass-card rounded-[28px] px-5 py-5">
          <h2 className="type-card-title text-[var(--color-ink)]">가장 먼저 할 일</h2>
          <p className="type-body mt-3 text-[rgba(16,21,47,0.7)]">
            아직 테스트를 안 했다면 메인 테스트에서 실제 MBTI와 추구미 여행 MBTI를 먼저 확인한 뒤, 결과 페이지에서
            해당 유형의 고정 URL을 공유하는 흐름이 가장 자연스럽습니다.
          </p>
          <Link href="/" className="primary-button mt-4 inline-flex rounded-[20px] px-4 py-3 font-strong text-sm">
            테스트 하러 가기
          </Link>
        </div>

        <div className="grid gap-4">
          {cmsData.resultTypes.map((type) => (
            <Link
              key={type.mbti_code}
              href={getResultTypePath(type.mbti_code)}
              className="glass-card rounded-[28px] px-5 py-5 transition hover:translate-y-[-2px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-strong text-xs uppercase tracking-[0.22em] text-[rgba(16,21,47,0.42)]">
                    {type.mbti_code}
                  </p>
                  <h2 className="mt-2 font-display text-[1.35rem] leading-[1.06] text-[var(--color-ink)]">
                    {type.title}
                  </h2>
                  <p className="mt-2 type-body-strong text-[rgba(16,21,47,0.72)]">{type.sub}</p>
                </div>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-white/80 text-4xl">
                  {type.emoji}
                </div>
              </div>

              <p className="type-body mt-4 text-[rgba(16,21,47,0.68)]">{getDescriptionLead(type.description)}</p>
              <p className="mt-4 text-sm font-strong text-[var(--color-secondary)]">{type.hashtags}</p>
            </Link>
          ))}
        </div>
      </div>
    </StaticPageShell>
  );
}
