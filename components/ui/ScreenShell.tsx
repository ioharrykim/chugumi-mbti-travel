import Link from 'next/link';

import { BrandLogo } from '@/components/ui/BrandLogo';

export function ScreenShell({
  children,
  onHome,
}: Readonly<{ children: React.ReactNode; onHome?: () => void }>) {
  return (
    <main className="app-shell px-4 py-5 md:px-8 md:py-8">
      <div className="scene-orb left-[-4rem] top-[10rem] h-48 w-48 bg-[rgba(255,146,112,0.14)]" />
      <div className="scene-orb right-[-4rem] top-[2rem] h-56 w-56 bg-[rgba(85,182,255,0.12)]" />
      <div className="scene-orb bottom-[-4rem] left-[18%] h-44 w-44 bg-[rgba(123,223,242,0.14)]" />

      <div className="mobile-viewport">
        <header className="mb-4">
          <button
            type="button"
            onClick={onHome}
            className="glass-card flex w-full items-center gap-3 rounded-full px-4 py-3 text-left transition hover:translate-y-[-1px]"
          >
            <BrandLogo
              className="h-12 w-auto max-w-[7rem] object-contain"
              fallbackClassName="font-display text-[2rem] leading-none text-[var(--color-ink)]"
            />
            <span className="section-kicker">Travel Alter Ego</span>
          </button>
        </header>

        <div>{children}</div>

        <footer className="mt-5 rounded-[28px] border border-white/70 bg-white/60 px-4 py-4 shadow-[0_18px_42px_rgba(20,67,130,0.08)] backdrop-blur-xl">
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
