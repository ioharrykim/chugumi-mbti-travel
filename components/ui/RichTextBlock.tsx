import { renderRichText } from '@/lib/rich-text';

export function RichTextBlock({
  value,
  className = '',
  as = 'div',
}: {
  value: string;
  className?: string;
  as?: 'div' | 'span';
}) {
  const Component = as;

  return <Component className={className}>{renderRichText(value)}</Component>;
}
