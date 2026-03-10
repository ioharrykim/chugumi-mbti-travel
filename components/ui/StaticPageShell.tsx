import Link from 'next/link';

import { BrandLogo } from '@/components/ui/BrandLogo';

export function StaticPageShell({
  kicker,
  title,
  description,
  children,
}: Readonly<{
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
}>) {
  return (
    <main className="app-shell px-4 py-5 md:px-8 md:py-8">
      <div className="scene-orb left-[-4rem] top-[10rem] h-48 w-48 bg-[rgba(255,146,112,0.14)]" />
      <div className="scene-orb right-[-4rem] top-[2rem] h-56 w-56 bg-[rgba(85,182,255,0.12)]" />
      <div className="scene-orb bottom-[-4rem] left-[18%] h-44 w-44 bg-[rgba(123,223,242,0.14)]" />

      <div className="mobile-viewport space-y-4">
        <header className="glass-card rounded-[30px] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-3 transition hover:translate-y-[-1px]">
              <BrandLogo
                className="h-12 w-auto max-w-[7rem] object-contain"
                fallbackClassName="font-display text-[2rem] leading-none text-[var(--color-ink)]"
              />
              <span className="section-kicker">Travel Alter Ego</span>
            </Link>
            <Link href="/" className="status-chip px-3 py-2">
              홈으로
            </Link>
          </div>
        </header>

        <section className="premium-card rounded-[38px] px-6 py-7">
          <p className="section-kicker">{kicker}</p>
          <h1 className="mt-4 type-title text-[var(--color-ink)]">{title}</h1>
          <p className="type-body mt-4 text-[rgba(16,21,47,0.7)]">{description}</p>
        </section>

        <section className="premium-card rounded-[38px] px-6 py-7">{children}</section>

        <footer className="rounded-[28px] border border-white/70 bg-white/60 px-4 py-4 shadow-[0_18px_42px_rgba(20,67,130,0.08)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[rgba(16,21,47,0.62)]">
            <Link href="/about" className="transition hover:text-[var(--color-ink)]">
              서비스 소개
            </Link>
            <Link href="/privacy" className="transition hover:text-[var(--color-ink)]">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="transition hover:text-[var(--color-ink)]">
              이용약관
            </Link>
            <Link href="/contact" className="transition hover:text-[var(--color-ink)]">
              문의하기
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
