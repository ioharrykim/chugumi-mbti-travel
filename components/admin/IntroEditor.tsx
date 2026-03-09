import { RichTextBlock } from '@/components/ui/RichTextBlock';
import { IntroContentRow } from '@/lib/types';
import { AdminField } from '@/components/admin/AdminField';

const INTRO_LABELS: Record<string, string> = {
  mainTitle: '메인 타이틀',
  subTitle: '서브 타이틀',
  heroEmoji: '히어로 이모지',
  description: '인트로 설명',
  step1: '안내 1단계',
  step2: '안내 2단계',
  step3: '안내 3단계',
  step4: '안내 4단계',
  startBtn: '시작 버튼',
  duration: '소요 시간 안내',
  passportTitle: '여권 심사 타이틀',
  passportSub: '여권 심사 설명',
  passportJoke: '여권 심사 유머 문구',
  passportBtn: '여권 심사 버튼',
  questionHint: '질문 하단 힌트',
  questionPrevBtn: '질문 이전 버튼',
  questionNextBtn: '질문 다음 버튼',
  questionResultBtn: '질문 결과 버튼',
  adsEnabled: '광고 노출 설정',
};

export function IntroEditor({
  rows,
  onChange,
}: {
  rows: IntroContentRow[];
  onChange: (index: number, value: string) => void;
}) {
  const previewRow = rows.find((row) => row.key === 'description');

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="grid gap-4">
        {rows.map((row, index) => (
          row.key === 'adsEnabled' ? (
            <div key={row.key} className="grid gap-3 rounded-[20px] border border-[rgba(26,26,46,0.08)] bg-white px-4 py-4">
              <div className="grid gap-1">
                <span className="text-sm font-black text-slate-700">{INTRO_LABELS[row.key] ?? row.key}</span>
                <span className="text-xs font-semibold text-slate-500">
                  `OFF`로 두면 광고 스크립트와 광고 구좌를 모두 숨깁니다.
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange(index, 'false')}
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${
                    row.value === 'false'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  OFF
                </button>
                <button
                  type="button"
                  onClick={() => onChange(index, 'true')}
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${
                    row.value === 'true'
                      ? 'bg-[var(--color-secondary)] text-white'
                      : 'bg-[rgba(92,107,192,0.08)] text-[var(--color-secondary)]'
                  }`}
                >
                  ON
                </button>
              </div>
            </div>
          ) : (
            <AdminField
              key={row.key}
              label={INTRO_LABELS[row.key] ?? row.key}
              value={row.value}
              multiline={row.key === 'description' || row.key.startsWith('step')}
              rows={row.key === 'description' ? 4 : 2}
              help={row.key === 'description' ? '\n, <hl>, <small> 마크업 사용 가능' : undefined}
              onChange={(value) => onChange(index, value)}
            />
          )
        ))}
      </div>
      <div className="rounded-[24px] bg-[rgba(255,255,255,0.9)] p-5 shadow-[0_12px_28px_rgba(26,26,46,0.06)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Preview</p>
        <div className="mt-4 space-y-4">
          <div className="text-5xl">{rows.find((row) => row.key === 'heroEmoji')?.value}</div>
          <h3 className="font-[var(--font-display)] text-4xl gradient-text">
            {rows.find((row) => row.key === 'mainTitle')?.value}
          </h3>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--color-secondary)]">
            {rows.find((row) => row.key === 'subTitle')?.value}
          </p>
          {previewRow ? <RichTextBlock value={previewRow.value} className="text-sm font-medium leading-6 text-slate-600" /> : null}
        </div>
      </div>
    </div>
  );
}
