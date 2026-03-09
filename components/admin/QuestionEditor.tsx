import { AdminField } from '@/components/admin/AdminField';
import { AXIS_LABELS } from '@/lib/constants';
import { Question } from '@/lib/types';

export function QuestionEditor({
  questions,
  selectedIndex,
  onSelect,
  onChange,
}: {
  questions: Question[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (index: number, field: 'emoji' | 'text' | 'a_label' | 'b_label', value: string) => void;
}) {
  const current = questions[selectedIndex];

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
      <div className="rounded-[24px] bg-white/90 p-4 shadow-[0_12px_28px_rgba(26,26,46,0.06)]">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Questions</p>
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-2">
          {questions.map((question, index) => (
            <button
              key={question.sort_order}
              type="button"
              onClick={() => onSelect(index)}
              className={`rounded-2xl px-3 py-3 text-sm font-black transition ${
                selectedIndex === index
                  ? 'bg-[var(--color-secondary)] text-white'
                  : 'bg-[rgba(92,107,192,0.08)] text-[var(--color-secondary)]'
              }`}
            >
              Q{question.sort_order}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 rounded-[24px] bg-white/90 p-5 shadow-[0_12px_28px_rgba(26,26,46,0.06)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[rgba(255,112,67,0.12)] px-3 py-1 text-xs font-black text-[var(--color-primary)]">
            {AXIS_LABELS[current.axis]}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
            A: {current.a_value}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
            B: {current.b_value}
          </span>
        </div>

        <AdminField label="이모지" value={current.emoji} onChange={(value) => onChange(selectedIndex, 'emoji', value)} />
        <AdminField label="질문 텍스트" value={current.text} multiline rows={4} onChange={(value) => onChange(selectedIndex, 'text', value)} />
        <AdminField label="선택지 A" value={current.a_label} multiline rows={4} onChange={(value) => onChange(selectedIndex, 'a_label', value)} />
        <AdminField label="선택지 B" value={current.b_label} multiline rows={4} onChange={(value) => onChange(selectedIndex, 'b_label', value)} />
      </div>
    </div>
  );
}
