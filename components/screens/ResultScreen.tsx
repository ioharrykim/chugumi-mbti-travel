'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { AdBanner } from '@/components/AdBanner';
import { compareMbti, getMatchMessage, getMatchRate, getRelevantGrowthTips } from '@/lib/calculate';
import { LETTER_COLORS } from '@/lib/constants';
import { getResultTypePath } from '@/lib/site';
import { generateStoryExportImages, StoryExportImage } from '@/lib/story-export';
import { GrowthTip, ResultType } from '@/lib/types';

function SectionTitle({ title, subtitle, kicker }: { title: string; subtitle?: string; kicker: string }) {
  return (
    <div className="space-y-3">
      <p className="section-kicker">{kicker}</p>
      <div className="space-y-2">
        <h3 className="font-display text-[1.52rem] leading-[1.05] text-[var(--color-ink)] break-keep">{title}</h3>
        {subtitle ? <p className="type-caption text-[rgba(16,21,47,0.62)]">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function HighlightCode({ code }: { code: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      {code.split('').map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className="hero-code-letter type-code"
          style={{ color: LETTER_COLORS[index] }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

function PassportStamp() {
  return (
    <svg viewBox="0 0 120 120" className="stamp-in h-24 w-24 rotate-[-10deg] text-[rgba(85,182,255,0.76)]">
      <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="4 5" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M28 61h64" stroke="currentColor" strokeWidth="2.5" />
      <path d="M39 39c6-5 13-8 21-8 8 0 16 3 21 8" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M39 81c6 5 13 8 21 8 8 0 16-3 21-8" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <text x="60" y="54" textAnchor="middle" fontSize="14" fontFamily="var(--font-strong)" fill="currentColor" letterSpacing="2">
        APPROVED
      </text>
      <text x="60" y="74" textAnchor="middle" fontSize="10" fontFamily="var(--font-strong)" fill="currentColor" letterSpacing="2">
        CHUGUMI VISA
      </text>
    </svg>
  );
}

function MatchMeter({ value }: { value: number }) {
  return (
    <div className="glass-card rounded-[28px] p-5">
      <p className="section-kicker">Sync Rate</p>
      <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/72">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-coral),var(--color-primary),var(--color-secondary))] transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="type-code text-[var(--color-ink)]">{value}%</p>
        <p className="type-caption max-w-[13rem] text-right text-[rgba(16,21,47,0.62)]">
          현실의 나와 추구미 여행자의 겹치는 비율
        </p>
      </div>
    </div>
  );
}

export function ResultScreen({
  actualMbti,
  chugumiMbti,
  resultType,
  growthTips,
  adsEnabled,
  onRetry,
}: {
  actualMbti: string;
  chugumiMbti: string;
  resultType: ResultType;
  growthTips: GrowthTip[];
  adsEnabled: boolean;
  onRetry: () => void;
}) {
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const [isGeneratingStories, setIsGeneratingStories] = useState(false);
  const [storyImages, setStoryImages] = useState<StoryExportImage[]>([]);

  const comparisonRows = useMemo(() => compareMbti(actualMbti, chugumiMbti), [actualMbti, chugumiMbti]);
  const matchRate = useMemo(() => getMatchRate(actualMbti, chugumiMbti), [actualMbti, chugumiMbti]);
  const matchMessage = useMemo(() => getMatchMessage(matchRate), [matchRate]);
  const relevantTips = useMemo(
    () => getRelevantGrowthTips(actualMbti, chugumiMbti, growthTips),
    [actualMbti, chugumiMbti, growthTips],
  );
  const characterBriefParagraphs = useMemo(
    () => resultType.description.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
    [resultType],
  );
  const resultTypePath = useMemo(() => getResultTypePath(chugumiMbti), [chugumiMbti]);

  const handleShare = async () => {
    const shareText = `나의 추구미 여행 MBTI는 ${chugumiMbti} ${resultType.title}! 실제 ${actualMbti}와 비교해봤어요.`;
    const shareUrl = typeof window !== 'undefined' ? new URL(resultTypePath, window.location.origin).toString() : resultTypePath;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: '추구미 여행 MBTI',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Fall back to clipboard copy when share sheet is dismissed.
      }
    }

    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setShareState('copied');
    window.setTimeout(() => setShareState('idle'), 1800);
  };

  const downloadImage = (url: string, fileName: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
  };

  const handleGenerateStories = async () => {
    if (isGeneratingStories) return;

    setIsGeneratingStories(true);

    try {
      const generatedStories = await generateStoryExportImages({
        actualMbti,
        chugumiMbti,
        resultType,
        comparisonRows,
        matchRate,
        matchMessage,
        growthTips: relevantTips,
      });

      setStoryImages(generatedStories);
      generatedStories.forEach((story) => downloadImage(story.url, story.fileName));
    } finally {
      setIsGeneratingStories(false);
    }
  };

  return (
    <motion.section
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-5"
    >
      <div className="premium-card relative overflow-hidden rounded-[38px] px-6 py-7">
        <div className="absolute -left-12 bottom-8 h-32 w-32 rounded-full bg-[rgba(255,146,112,0.14)] blur-3xl" />
        <div className="absolute right-[-2rem] top-20 h-32 w-32 rounded-full bg-[rgba(85,182,255,0.12)] blur-3xl" />

        <div className="relative space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-[14rem]">
              <p className="section-kicker">Your travel alter ego</p>
              <h2 className="mt-3 font-display text-[1.68rem] leading-[1.02] text-[var(--color-ink)] break-keep">
                {resultType.title}
              </h2>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <PassportStamp />
              <div className="glass-card float-emoji flex h-20 w-20 items-center justify-center rounded-[28px] text-5xl">
                {resultType.emoji}
              </div>
            </div>
          </div>

          <HighlightCode code={chugumiMbti} />

          <div className="grid gap-3">
            <div className="glass-card rounded-[26px] p-5">
              <p className="font-strong text-xs uppercase tracking-[0.22em] text-[rgba(16,21,47,0.4)]">
                character brief
              </p>
              <p className="mt-3 font-display text-[1.28rem] leading-[1.16] text-[var(--color-ink)] break-keep">
                {resultType.sub}
              </p>
              <div className="mt-4 space-y-4">
                {characterBriefParagraphs.map((paragraph) => (
                  <p key={paragraph} className="type-body text-[rgba(16,21,47,0.72)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[26px] p-5">
              <p className="font-strong text-xs uppercase tracking-[0.22em] text-[rgba(16,21,47,0.4)]">
                travel keywords
              </p>
              <p className="mt-3 break-keep font-strong text-[1.22rem] leading-[1.28] text-[var(--color-ink)]">
                {resultType.hashtags}
              </p>
              <div className="mt-4 dashed-divider pt-4">
                <p className="type-body text-[rgba(16,21,47,0.62)]">
                  현실 MBTI와 이상 MBTI의 차이를 아래에서 축별로 해석해드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner slot="result-top" enabled={adsEnabled} />

      <div className="premium-card rounded-[38px] px-6 py-7">
        <SectionTitle
          kicker="Reality Check"
          title="실제 vs 추구미"
          subtitle="어느 축을 유지하고, 어느 축을 더 세게 밀고 싶은지 한눈에 볼 수 있게 정리했습니다."
        />

        <div className="mt-5 grid gap-4">
          <div className="grid gap-4">
            <div className="glass-card rounded-[26px] p-5 text-center">
              <p className="font-strong text-xs uppercase tracking-[0.22em] text-[rgba(16,21,47,0.42)]">Actual</p>
              <p className="mt-3 font-display text-[2.4rem] leading-none text-[var(--color-ink)]">{actualMbti}</p>
            </div>
            <div className="mx-auto font-display text-4xl text-[var(--color-coral)]">→</div>
            <div className="glass-card rounded-[26px] p-5 text-center">
              <p className="font-strong text-xs uppercase tracking-[0.22em] text-[rgba(16,21,47,0.42)]">Chugumi</p>
              <p className="mt-3 font-display text-[2.4rem] leading-none text-[var(--color-secondary)]">
                {chugumiMbti}
              </p>
            </div>
          </div>

          <MatchMeter value={matchRate} />

          <div className="glass-card rounded-[28px] p-5">
            <p className="type-body text-[rgba(16,21,47,0.66)]">{matchMessage}</p>
            <div className="mt-4 space-y-3">
              {comparisonRows.map((row) => (
                <div key={row.axis} className="rounded-[22px] bg-white/76 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="status-chip">{row.label}</span>
                    <span
                      className={`rounded-full px-3 py-1 font-strong text-xs uppercase tracking-[0.18em] ${
                        row.changed
                          ? 'bg-[rgba(85,182,255,0.12)] text-[var(--color-secondary)]'
                          : 'bg-[rgba(16,21,47,0.06)] text-[rgba(16,21,47,0.52)]'
                      }`}
                    >
                      {row.changed ? 'change' : 'same'}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-3 font-display text-[1.75rem]">
                    <span className="text-[rgba(16,21,47,0.38)]">{row.actual}</span>
                    <span className="text-[rgba(16,21,47,0.22)]">→</span>
                    <span className={row.changed ? 'gradient-text' : 'text-[rgba(16,21,47,0.38)]'}>
                      {row.chugumi}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="premium-card rounded-[38px] px-6 py-7">
        <SectionTitle
          kicker="Field Guide"
          title="성장 가이드"
          subtitle="바뀐 축만 골라 실제 여행에서 바로 써먹을 수 있게 행동 레벨로 정리했습니다."
        />

        <div className="mt-5 grid gap-4">
          {relevantTips.length ? (
            relevantTips.map((tip, index) => (
              <motion.div
                key={tip.direction}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                className="glass-card rounded-[30px] p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,rgba(255,146,112,0.12),rgba(85,182,255,0.14))] text-3xl">
                    {tip.icon}
                  </div>
                  <div>
                    <p className="font-strong text-xs uppercase tracking-[0.24em] text-[rgba(16,21,47,0.42)]">
                      {tip.direction}
                    </p>
                    <h4 className="mt-1 font-display text-[1.18rem] leading-[1.12] text-[var(--color-ink)] break-keep">
                      {tip.title}
                    </h4>
                  </div>
                </div>
                <div className="mt-4 grid gap-2.5">
                  {tip.tips.split('|').map((item) => (
                    <div key={item} className="rounded-[20px] bg-white/80 px-4 py-4">
                      <p className="type-body text-[rgba(16,21,47,0.7)]">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-card rounded-[30px] px-5 py-6 text-center">
              <p className="text-5xl">🏆</p>
              <h4 className="mt-4 font-display text-[1.68rem] leading-[1.04] text-[var(--color-ink)] break-keep">
                이미 추구미 여행자에 도달!
              </h4>
              <p className="type-body mt-3 text-[rgba(16,21,47,0.68)]">
                실제 성향과 이상적인 여행 캐릭터가 완전히 일치합니다. 이번 여행은 새 캐릭터를 만들기보다,
                원래 잘하던 방식을 더 세련되게 밀어주면 됩니다.
              </p>
            </div>
          )}
        </div>
      </div>

      <AdBanner slot="result-bottom" enabled={adsEnabled} />

      <div className="premium-card rounded-[38px] px-6 py-6">
        <div className="grid gap-3">
          <Link href={resultTypePath} className="secondary-button rounded-[24px] px-5 py-4 text-center font-strong text-base">
            이 유형 상세 보기
          </Link>
          <button
            type="button"
            onClick={handleGenerateStories}
            disabled={isGeneratingStories}
            className="secondary-button rounded-[24px] px-5 py-4 font-strong text-base disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isGeneratingStories ? '이미지 생성 중...' : '이미지로 저장하기 (스토리 3장)'}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="primary-button rounded-[24px] px-5 py-4 font-strong text-base"
          >
            {shareState === 'copied' ? '복사 완료!' : '결과 공유하기'}
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="secondary-button rounded-[24px] px-5 py-4 font-strong text-base"
          >
            다시 하기
          </button>
        </div>
      </div>

      {storyImages.length ? (
        <div className="premium-card rounded-[38px] px-6 py-6">
          <SectionTitle
            kicker="Story Export"
            title="저장용 스토리 3장"
            subtitle="인스타그램 스토리에 바로 올릴 수 있도록 9:16 비율로 생성했습니다."
          />
          <div className="mt-5 grid gap-4">
            {storyImages.map((story) => (
              <div key={story.fileName} className="glass-card rounded-[28px] p-4">
                <Image
                  src={story.url}
                  alt={story.title}
                  width={360}
                  height={640}
                  unoptimized
                  className="h-auto w-full rounded-[22px] border border-white/80 shadow-[0_16px_30px_rgba(7,16,32,0.12)]"
                />
                <button
                  type="button"
                  onClick={() => downloadImage(story.url, story.fileName)}
                  className="secondary-button mt-3 w-full rounded-[20px] px-4 py-3 font-strong"
                >
                  {story.title} 다시 저장
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </motion.section>
  );
}
