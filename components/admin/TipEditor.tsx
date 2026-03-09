import { AdminField } from '@/components/admin/AdminField';
import { GrowthTip } from '@/lib/types';

export function TipEditor({
  tips,
  selectedIndex,
  onSelect,
  onChange,
}: {
  tips: GrowthTip[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onChange: (index: number, field: 'icon' | 'title' | 'tips', value: string) => void;
}) {
  const current = tips[selectedIndex];

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <div className="rounded-[24px] bg-white/90 p-4 shadow-[0_12px_28px_rgba(26,26,46,0.06)]">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Growth Tips</p>
        <div className="grid gap-2">
          {tips.map((tip, index) => (
            <button
              key={tip.direction}
              type="button"
              onClick={() => onSelect(index)}
              className={`rounded-2xl px-3 py-3 text-sm font-black transition ${
                selectedIndex === index
                  ? 'bg-[var(--color-secondary)] text-white'
                  : 'bg-[rgba(92,107,192,0.08)] text-[var(--color-secondary)]'
              }`}
            >
              {tip.direction}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 rounded-[24px] bg-white/90 p-5 shadow-[0_12px_28px_rgba(26,26,46,0.06)]">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(255,112,67,0.12)] text-3xl">
            {current.icon}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{current.direction}</p>
            <p className="text-lg font-black text-[var(--color-dark)]">{current.title}</p>
          </div>
        </div>
        <AdminField label="아이콘" value={current.icon} onChange={(value) => onChange(selectedIndex, 'icon', value)} />
        <AdminField label="타이틀" value={current.title} onChange={(value) => onChange(selectedIndex, 'title', value)} />
        <AdminField label="팁 (| 구분)" value={current.tips} multiline rows={6} onChange={(value) => onChange(selectedIndex, 'tips', value)} />
        <div className="rounded-[20px] bg-[rgba(255,249,240,0.9)] p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Preview</p>
          <div className="mt-3 space-y-2">
            {current.tips.split('|').map((item) => (
              <p key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
