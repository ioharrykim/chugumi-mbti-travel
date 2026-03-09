export function ProgressBar({ value, total }: { value: number; total: number }) {
  const percentage = total ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-kicker">Journey Progress</p>
          <p className="type-stat mt-2 text-[var(--color-ink)]">{percentage}% boarded</p>
        </div>
        <div className="glass-card rounded-[20px] px-4 py-3 text-right">
          <p className="font-strong text-xs uppercase tracking-[0.22em] text-[rgba(16,21,47,0.45)]">answered</p>
          <p className="type-stat mt-1 text-[var(--color-ink)]">{value}/{total}</p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-1.5">
        {Array.from({ length: total }, (_, index) => {
          const active = index < value;
          return (
            <div
              key={index}
              className={`h-3 rounded-full transition-all duration-300 ${
                active
                  ? 'meter-pulse bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent))]'
                  : 'bg-[rgba(255,255,255,0.72)]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
