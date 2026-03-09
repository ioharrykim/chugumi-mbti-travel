export function BootScreen() {
  return (
    <section className="premium-card ticket-grid relative overflow-hidden rounded-[38px] px-6 py-7">
      <div className="absolute -right-10 top-12 h-32 w-32 rounded-full bg-[rgba(85,182,255,0.14)] blur-3xl" />
      <div className="absolute -left-10 bottom-8 h-28 w-28 rounded-full bg-[rgba(255,146,112,0.16)] blur-3xl" />

      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="status-chip">Preparing Boarding</span>
            <p className="section-kicker">loading your custom travel dossier</p>
          </div>
          <div className="glass-card flex h-20 w-20 items-center justify-center rounded-[28px] text-5xl plane-wiggle">
            ✈️
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-strong text-sm uppercase tracking-[0.42em] text-[rgba(16,21,47,0.45)]">
            CMS SYNC
          </p>
          <h1 className="type-hero text-[var(--color-ink)]">
            추구미 여행
            <span className="mt-2 block gradient-text">준비 중</span>
          </h1>
          <p className="type-body max-w-[26rem] text-[rgba(16,21,47,0.68)]">
            저장된 문구와 질문지를 불러오는 중입니다. 잠시만 기다리면 커스텀 버전으로 바로 시작합니다.
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-4">
          <div className="space-y-3">
            <div className="h-3 overflow-hidden rounded-full bg-white/70">
              <div className="meter-pulse h-full w-2/3 rounded-full bg-[linear-gradient(90deg,var(--color-coral),var(--color-primary),var(--color-secondary))]" />
            </div>
            <div className="grid gap-2">
              <div className="h-12 rounded-[18px] bg-white/72" />
              <div className="h-12 rounded-[18px] bg-white/66" />
              <div className="h-12 rounded-[18px] bg-white/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
