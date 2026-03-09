'use client';

import Image from 'next/image';
import { useState } from 'react';

type BrandLogoProps = {
  alt?: string;
  className?: string;
  fallbackClassName?: string;
  src?: string;
};

export function BrandLogo({
  alt = '추구미',
  className = 'h-14 w-auto',
  fallbackClassName = 'font-display text-[2rem] leading-none text-[var(--color-ink)]',
  src = '/brand-logo.svg',
}: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <Image
        src={src}
        alt={alt}
        width={240}
        height={96}
        unoptimized
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  return <span className={fallbackClassName}>추구미</span>;
}
