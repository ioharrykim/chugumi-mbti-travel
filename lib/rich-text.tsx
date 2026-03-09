import { Fragment, ReactNode } from 'react';

function renderInline(text: string) {
  const parts = text.split(/(<hl>.*?<\/hl>|<small>.*?<\/small>)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('<hl>') && part.endsWith('</hl>')) {
      const content = part.replace(/^<hl>|<\/hl>$/g, '');
      return (
        <span
          key={`${content}-${index}`}
          className="rounded-full bg-[rgba(85,182,255,0.16)] px-2 py-0.5 text-[var(--color-secondary)]"
        >
          {content}
        </span>
      );
    }

    if (part.startsWith('<small>') && part.endsWith('</small>')) {
      const content = part.replace(/^<small>|<\/small>$/g, '');
      return (
        <small key={`${content}-${index}`} className="block text-sm text-slate-500">
          {content}
        </small>
      );
    }

    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
}

export function renderRichText(input: string): ReactNode {
  return input.split('\n').map((line, index) => (
    <Fragment key={`${line}-${index}`}>
      {renderInline(line)}
      {index < input.split('\n').length - 1 ? <br /> : null}
    </Fragment>
  ));
}
