'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { PASSPORT_GROUP_LABELS } from '@/lib/constants';
import { IntroContentMap } from '@/lib/types';

const groups = [
  { key: 'EI', label: PASSPORT_GROUP_LABELS.EI, letters: ['E', 'I'] },
  { key: 'SN', label: PASSPORT_GROUP_LABELS.SN, letters: ['S', 'N'] },
  { key: 'TF', label: PASSPORT_GROUP_LABELS.TF, letters: ['T', 'F'] },
  { key: 'JP', label: PASSPORT_GROUP_LABELS.JP, letters: ['J', 'P'] },
] as const;

export function MbtiInputScreen({
  content,
  initialValue,
  onSubmit,
  onBack,
}: {
  content: IntroContentMap;
  initialValue?: string;
  onSubmit: (mbti: string) => void;
  onBack: () => void;
}) {
  const initial = initialValue?.length === 4 ? initialValue.split('') : ['', '', '', ''];
  const [selectedLetters, setSelectedLetters] = useState<string[]>(initial);

  const composedMbti = useMemo(() => selectedLetters.join(''), [selectedLetters]);
  const displayedMbti = useMemo(
    () => selectedLetters.map((letter) => letter || '•'),
    [selectedLetters],
  );
  const isComplete = selectedLetters.every(Boolean);

  const handleSelect = (index: number, letter: string) => {
    setSelectedLetters((prev) => prev.map((value, currentIndex) => (currentIndex === index ? letter : value)));
  };

  return (
    <motion.section
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="space-y-4"
    >
      <div className="premium-card relative overflow-hidden rounded-[38px] px-6 py-7">
        <div className="absolute -right-10 top-10 h-36 w-36 rounded-full bg-[rgba(85,182,255,0.16)] blur-3xl" />
        <div className="absolute -left-10 bottom-10 h-28 w-28 rounded-full bg-[rgba(255,146,112,0.16)] blur-3xl" />

        <div className="relative space-y-6 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <button
                type="button"
                onClick={onBack}
                className="secondary-button rounded-full px-4 py-2 font-strong text-sm"
              >
                ← 메인으로
              </button>
              <div>
                <span className="status-chip">Passport Control</span>
                <h2 className="mt-4 font-display text-[1.88rem] leading-[0.98] text-[var(--color-ink)]">
                  {content.passportTitle}
                </h2>
                <p className="type-body mt-3 text-[rgba(16,21,47,0.72)]">{content.passportSub}</p>
                <p className="mt-2 font-strong text-sm text-[rgba(16,21,47,0.44)]">{content.passportJoke}</p>
              </div>
            </div>
            <div className="glass-card rounded-[24px] px-4 py-3 text-right">
              <p className="font-strong text-xs uppercase tracking-[0.24em] text-[rgba(16,21,47,0.42)]">
                issued
              </p>
              <p className="mt-2 font-display text-[2rem] leading-none text-[var(--color-secondary)]">2026</p>
            </div>
          </div>

          <div className="glass-card rounded-[28px] p-5">
            <p className="section-kicker">Passport Guide</p>
            <p className="type-body mt-4 text-[rgba(16,21,47,0.68)]">
              각 축에서 현재의 나를 고르면 아래 패스포트 번호가 바로 업데이트됩니다. 네 칸을 모두 채워야 탑승
              수속을 완료할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-3">
            {groups.map((group, groupIndex) => (
              <div key={group.key} className="glass-card rounded-[26px] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-display text-[1.2rem] leading-[1.12] text-[var(--color-ink)] break-keep">{group.label}</p>
                  <p className="font-strong text-xs uppercase tracking-[0.22em] text-[rgba(16,21,47,0.38)]">
                    choose 1 of 2
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {group.letters.map((letter) => {
                    const active = selectedLetters[groupIndex] === letter;

                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => handleSelect(groupIndex, letter)}
                        className={`rounded-[22px] border px-4 py-4 text-left transition-all duration-200 ${
                          active
                            ? 'border-[rgba(85,182,255,0.28)] bg-[linear-gradient(135deg,rgba(85,182,255,0.16),rgba(123,223,242,0.14))] shadow-[0_18px_28px_rgba(85,182,255,0.14)]'
                            : 'border-transparent bg-white/72 hover:border-[rgba(85,182,255,0.2)] hover:bg-white'
                        }`}
                      >
                        <span className="font-display text-[2.35rem] leading-none text-[var(--color-ink)]">{letter}</span>
                        <span className="mt-2 block font-strong text-xs uppercase tracking-[0.2em] text-[rgba(16,21,47,0.42)]">
                          {active ? 'selected' : 'select'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 z-20">
        <div className="passport-code rounded-[30px] p-4 text-white shadow-[0_24px_44px_rgba(7,16,32,0.26)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-strong text-xs uppercase tracking-[0.26em] text-white/56">Passport Number</p>
              <p className="mt-2 font-body text-sm text-white/72">선택할 때마다 아래 번호가 바로 찍힙니다.</p>
            </div>
            <span className="status-chip border-white/16 bg-white/10 text-white">Identity</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {displayedMbti.map((letter, index) => (
              <div key={`${letter}-${index}`} className={`hero-code-letter type-code ${selectedLetters[index] ? 'pop-in' : ''}`}>
                {letter}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => isComplete && onSubmit(composedMbti)}
            disabled={!isComplete}
            className="primary-button mt-4 w-full rounded-[22px] px-4 py-4 font-strong text-base disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isComplete ? `${content.passportBtn} (${composedMbti})` : '4개 축을 모두 선택하면 진행됩니다'}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
