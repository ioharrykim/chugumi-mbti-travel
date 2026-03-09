import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { StaticPageShell } from '@/components/ui/StaticPageShell';
import { DEFAULT_RESULT_TYPES } from '@/lib/constants';
import { getDescriptionLead, getResultTypeByCode, normalizeMbtiCode } from '@/lib/result-types';
import { getServerCmsData } from '@/lib/server-cms';
import { getAbsoluteUrl, getResultTypePath } from '@/lib/site';

export async function generateStaticParams() {
  return DEFAULT_RESULT_TYPES.map((type) => ({
    mbti: type.mbti_code.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mbti: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const mbtiCode = normalizeMbtiCode(resolvedParams.mbti);
  const cmsData = await getServerCmsData();
  const resultType = getResultTypeByCode(cmsData.resultTypes, mbtiCode);

  if (!resultType) {
    return {
      title: '결과 유형을 찾을 수 없음 | 추구미 여행 MBTI',
      description: '요청한 추구미 여행 MBTI 결과 유형을 찾을 수 없습니다.',
    };
  }

  const description = getDescriptionLead(resultType.description);
  const path = getResultTypePath(resultType.mbti_code);

  return {
    title: `${resultType.mbti_code} ${resultType.title} | 추구미 여행 MBTI`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${resultType.mbti_code} ${resultType.title}`,
      description,
      type: 'article',
      url: getAbsoluteUrl(path),
      images: [`/api/og?chugumi=${resultType.mbti_code}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${resultType.mbti_code} ${resultType.title}`,
      description,
      images: [`/api/og?chugumi=${resultType.mbti_code}`],
    },
  };
}

export default async function ResultTypeDetailPage({
  params,
}: {
  params: Promise<{ mbti: string }>;
}) {
  const resolvedParams = await params;
  const mbtiCode = normalizeMbtiCode(resolvedParams.mbti);
  const cmsData = await getServerCmsData();
  const resultType = getResultTypeByCode(cmsData.resultTypes, mbtiCode);

  if (!resultType) {
    notFound();
  }

  const descriptionParagraphs = resultType.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const otherTypes = cmsData.resultTypes.filter((item) => item.mbti_code !== resultType.mbti_code).slice(0, 6);

  return (
    <StaticPageShell
      kicker="Type Detail"
      title={`${resultType.mbti_code} · ${resultType.title}`}
      description={`${resultType.sub} 유형의 상세 페이지입니다. 검색이나 공유 링크로 들어온 사용자가 결과 의미를 바로 이해할 수 있도록 설명과 키워드를 고정 URL로 제공합니다.`}
    >
      <div className="space-y-5">
        <section className="premium-card rounded-[32px] px-5 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="section-kicker">Travel Result</p>
              <h2 className="font-display text-[2rem] leading-[0.98] text-[var(--color-ink)] break-keep">
                {resultType.title}
              </h2>
              <p className="type-card-title text-[rgba(16,21,47,0.68)]">{resultType.sub}</p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[26px] bg-white/82 text-5xl shadow-[0_18px_34px_rgba(16,21,47,0.08)]">
              {resultType.emoji}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center rounded-[26px] bg-white/76 px-4 py-5">
            <p className="font-display text-[2.6rem] leading-none text-[var(--color-ink)]">{resultType.mbti_code}</p>
          </div>

          <div className="mt-5 space-y-4">
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph} className="type-body text-[rgba(16,21,47,0.72)]">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-5 rounded-[24px] bg-[rgba(85,182,255,0.1)] px-4 py-4">
            <p className="font-strong text-xs uppercase tracking-[0.22em] text-[rgba(16,21,47,0.42)]">
              travel keywords
            </p>
            <p className="mt-3 break-keep text-lg font-strong leading-[1.35] text-[var(--color-secondary)]">
              {resultType.hashtags}
            </p>
          </div>
        </section>

        <section className="glass-card rounded-[30px] px-5 py-5">
          <h2 className="type-card-title text-[var(--color-ink)]">이 페이지를 어떻게 쓰면 좋은가</h2>
          <ul className="type-body mt-3 list-disc space-y-2 pl-5 text-[rgba(16,21,47,0.7)]">
            <li>친구에게 내 추구미 여행 결과를 공유할 때 고정 링크로 사용</li>
            <li>검색 유입 사용자가 MBTI 결과별 설명을 바로 읽을 수 있는 랜딩 페이지로 사용</li>
            <li>광고 승인 후에는 결과형 텍스트 콘텐츠 페이지로 운영</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/" className="primary-button rounded-[20px] px-4 py-3 font-strong text-sm">
              나도 테스트 하기
            </Link>
            <Link href="/type" className="secondary-button rounded-[20px] px-4 py-3 font-strong text-sm">
              다른 유형 보기
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="section-kicker">More Types</p>
            <h2 className="mt-2 font-display text-[1.5rem] leading-[1.06] text-[var(--color-ink)]">
              다른 결과도 같이 보기
            </h2>
          </div>
          <div className="grid gap-3">
            {otherTypes.map((type) => (
              <Link
                key={type.mbti_code}
                href={getResultTypePath(type.mbti_code)}
                className="glass-card rounded-[24px] px-4 py-4 transition hover:translate-y-[-2px]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-strong text-xs uppercase tracking-[0.2em] text-[rgba(16,21,47,0.42)]">
                      {type.mbti_code}
                    </p>
                    <h3 className="mt-2 font-display text-[1.18rem] leading-[1.08] text-[var(--color-ink)]">
                      {type.title}
                    </h3>
                    <p className="mt-2 text-sm text-[rgba(16,21,47,0.68)]">{type.sub}</p>
                  </div>
                  <div className="text-3xl">{type.emoji}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </StaticPageShell>
  );
}
