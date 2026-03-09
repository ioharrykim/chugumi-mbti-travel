import { AdminField } from '@/components/admin/AdminField';
import { ResultType } from '@/lib/types';

export function TypeEditor({
  types,
  selectedIndex,
  onSelect,
  onChange,
}: {
  types: ResultType[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (index: number, field: 'emoji' | 'title' | 'sub' | 'description' | 'hashtags', value: string) => void;
}) {
  const current = types[selectedIndex];

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <div className="rounded-[24px] bg-white/90 p-4 shadow-[0_12px_28px_rgba(26,26,46,0.06)]">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Result Types</p>
        <div className="grid grid-cols-2 gap-2">
          {types.map((type, index) => (
            <button
              key={type.mbti_code}
              type="button"
              onClick={() => onSelect(index)}
              className={`rounded-2xl px-3 py-3 text-sm font-black transition ${
                selectedIndex === index
                  ? 'bg-[var(--color-secondary)] text-white'
                  : 'bg-[rgba(92,107,192,0.08)] text-[var(--color-secondary)]'
              }`}
            >
              {type.mbti_code}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 rounded-[24px] bg-white/90 p-5 shadow-[0_12px_28px_rgba(26,26,46,0.06)]">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(255,112,67,0.12)] text-3xl">
            {current.emoji}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{current.mbti_code}</p>
            <p className="text-lg font-black text-[var(--color-dark)]">{current.title}</p>
          </div>
        </div>
        <AdminField label="이모지" value={current.emoji} onChange={(value) => onChange(selectedIndex, 'emoji', value)} />
        <AdminField label="타이틀" value={current.title} onChange={(value) => onChange(selectedIndex, 'title', value)} />
        <AdminField label="서브 타이틀" value={current.sub} onChange={(value) => onChange(selectedIndex, 'sub', value)} />
        <AdminField
          label="설명"
          value={current.description}
          multiline
          rows={10}
          onChange={(value) => onChange(selectedIndex, 'description', value)}
        />
        <AdminField label="해시태그" value={current.hashtags} multiline rows={3} onChange={(value) => onChange(selectedIndex, 'hashtags', value)} />
      </div>
    </div>
  );
}
