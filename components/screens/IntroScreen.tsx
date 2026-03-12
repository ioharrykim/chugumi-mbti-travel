import { motion } from 'framer-motion';

import { RichTextBlock } from '@/components/ui/RichTextBlock';
import { IntroContentMap } from '@/lib/types';

export function IntroScreen({ content, onStart }: { content: IntroContentMap; onStart: () => void }) {
  const steps = [content.step1, content.step2, content.step3, content.step4];

  return (
    <motion.section
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="premium-card ticket-grid relative overflow-hidden rounded-[38px] px-6 py-7"
    >
      <div className="absolute -right-12 top-14 h-32 w-32 rounded-full bg-[rgba(85,182,255,0.16)] blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-[rgba(255,146,112,0.18)] blur-3xl" />

      <div className="relative space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="status-chip">탑승 시작</span>
            <p className="section-kicker">여행 캐릭터 테스트</p>
          </div>
          <div className="glass-card flex h-20 w-20 items-center justify-center rounded-[28px] text-5xl plane-wiggle">
            {content.heroEmoji}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <p className="font-strong text-sm uppercase tracking-[0.42em] text-[rgba(16,21,47,0.45)]">
              {content.subTitle}
            </p>
            <h1 className="type-hero text-[var(--color-ink)]">
              {content.mainTitle}
              <span className="mt-2 block gradient-text">MBTI</span>
            </h1>
          </div>
          <RichTextBlock value={content.description} className="type-body max-w-[28rem] text-[rgba(16,21,47,0.72)]" />
        </div>

        <div className="grid gap-3">
          {steps.map((step, index) => (
            <div key={step} className="glass-card rounded-[24px] px-4 py-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))] font-display text-lg text-white shadow-[0_10px_22px_rgba(85,182,255,0.24)]">
                  {index + 1}
                </div>
                <div>
                  <p className="font-strong text-xs uppercase tracking-[0.24em] text-[rgba(16,21,47,0.4)]">단계 0{index + 1}</p>
                  <p className="mt-1 font-body text-[0.95rem] leading-6 text-[rgba(16,21,47,0.74)]">{step}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[28px] p-4">
          <div className="flex flex-col gap-4">
            <div>
              <p className="section-kicker">예상 소요 시간</p>
              <p className="type-card-title mt-2 text-[var(--color-ink)]">2~3분 안에 끝나요</p>
              <p className="type-caption mt-2 text-[rgba(16,21,47,0.62)]">{content.duration}</p>
            </div>
            <button
              type="button"
              onClick={onStart}
              className="primary-button rounded-[24px] px-6 py-4 font-strong text-base"
            >
              {content.startBtn}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
