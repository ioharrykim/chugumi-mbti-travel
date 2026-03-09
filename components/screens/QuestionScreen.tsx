'use client';

import { motion } from 'framer-motion';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { RichTextBlock } from '@/components/ui/RichTextBlock';
import { AXIS_LABELS } from '@/lib/constants';
import { IntroContentMap, Question } from '@/lib/types';

function ChoiceCard({
  label,
  marker,
  selected,
  onClick,
}: {
  label: string;
  marker: string;
  selected: boolean;
  onClick: () => void;
}) {
  const isRouteA = marker === 'A';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-[28px] border px-5 py-5 text-left transition-all duration-200 ${
        selected
          ? isRouteA
            ? 'border-[rgba(255,146,112,0.28)] bg-[linear-gradient(135deg,rgba(255,146,112,0.16),rgba(255,200,106,0.14))] shadow-[0_18px_30px_rgba(255,146,112,0.14)]'
            : 'border-[rgba(85,182,255,0.24)] bg-[linear-gradient(135deg,rgba(85,182,255,0.14),rgba(123,223,242,0.1))] shadow-[0_18px_30px_rgba(85,182,255,0.12)]'
          : isRouteA
            ? 'border-transparent bg-[linear-gradient(135deg,rgba(255,255,255,0.84),rgba(255,247,241,0.92))] hover:border-[rgba(255,146,112,0.2)] hover:bg-white'
            : 'border-transparent bg-[linear-gradient(135deg,rgba(255,255,255,0.84),rgba(239,248,255,0.92))] hover:border-[rgba(85,182,255,0.18)] hover:bg-white'
      }`}
    >
      <div
        className={`absolute inset-y-0 ${isRouteA ? 'left-0' : 'right-0'} w-1 opacity-80 ${
          isRouteA
            ? 'bg-[linear-gradient(180deg,var(--color-coral),var(--color-highlight))]'
            : 'bg-[linear-gradient(180deg,var(--color-secondary),var(--color-primary))]'
        }`}
      />
      <div className="ml-2 flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] font-display text-2xl leading-none ${
            selected
              ? isRouteA
                ? 'bg-[var(--color-coral)] text-white'
                : 'bg-[var(--color-secondary)] text-white'
              : isRouteA
                ? 'bg-[rgba(255,146,112,0.1)] text-[var(--color-coral)]'
                : 'bg-[rgba(85,182,255,0.1)] text-[var(--color-secondary)]'
          }`}
        >
          {selected ? '✓' : marker}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p
              className={`font-strong text-xs uppercase tracking-[0.24em] ${
                isRouteA ? 'text-[rgba(255,146,112,0.82)]' : 'text-[rgba(45,98,217,0.74)]'
              }`}
            >
              route {marker}
            </p>
            <p className="font-strong text-xs uppercase tracking-[0.2em] text-[rgba(16,21,47,0.34)]">
              {selected ? 'picked' : isRouteA ? 'warm route' : 'cool route'}
            </p>
          </div>
          <RichTextBlock
            value={label}
            className="mt-3 font-strong text-[0.98rem] leading-[1.62] text-[rgba(16,21,47,0.78)]"
          />
        </div>
      </div>
    </button>
  );
}

export function QuestionScreen({
  content,
  question,
  currentIndex,
  total,
  answeredCount,
  selectedValue,
  onAnswer,
  onNext,
  onPrev,
}: {
  content: IntroContentMap;
  question: Question;
  currentIndex: number;
  total: number;
  answeredCount: number;
  selectedValue?: string;
  onAnswer: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const isLast = currentIndex === total - 1;

  return (
    <motion.section
      key={question.sort_order}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className="premium-card relative overflow-hidden rounded-[38px] px-6 py-7"
    >
      <div className="absolute -right-8 top-20 h-28 w-28 rounded-full bg-[rgba(85,182,255,0.12)] blur-3xl" />
      <div className="relative space-y-6">
        <ProgressBar value={answeredCount} total={total} />

        <div className="glass-card rounded-[30px] p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="status-chip px-3 py-2">{AXIS_LABELS[question.axis]}</span>
            <p className="type-stat text-[var(--color-ink)]">
              {currentIndex + 1}
              <span className="font-body text-[1rem] text-[rgba(16,21,47,0.42)]"> / {total}</span>
            </p>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="glass-card float-emoji flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-[24px] px-4 text-[2.75rem]">
              {question.emoji}
            </div>
            <div className="min-w-0">
              <p className="section-kicker">Choose your fantasy self</p>
              <h2 className="mt-3 font-display text-[1.56rem] leading-[1.08] text-[var(--color-ink)] break-keep">
                <RichTextBlock value={question.text} as="span" />
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <ChoiceCard
            label={question.a_label}
            marker="A"
            selected={selectedValue === question.a_value}
            onClick={() => onAnswer(question.a_value)}
          />
          <ChoiceCard
            label={question.b_label}
            marker="B"
            selected={selectedValue === question.b_value}
            onClick={() => onAnswer(question.b_value)}
          />
        </div>

        <div className="glass-card rounded-[28px] p-4">
          <div className="flex flex-col gap-4">
            <p className="type-caption max-w-[20rem] text-[rgba(16,21,47,0.66)]">{content.questionHint}</p>
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="secondary-button flex-1 rounded-[20px] px-4 py-3 font-strong disabled:cursor-not-allowed disabled:opacity-35"
              >
                {content.questionPrevBtn}
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!selectedValue}
                className="primary-button flex-1 rounded-[20px] px-4 py-3 font-strong disabled:cursor-not-allowed disabled:opacity-35"
              >
                {isLast ? content.questionResultBtn : content.questionNextBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
