interface AdminFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  help?: string;
}

export function AdminField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 4,
  disabled = false,
  help,
}: AdminFieldProps) {
  const sharedClassName =
    'w-full rounded-[18px] border border-[rgba(26,26,46,0.08)] bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[rgba(92,107,192,0.46)] focus:ring-4 focus:ring-[rgba(92,107,192,0.12)] disabled:bg-slate-100';

  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={sharedClassName}
        />
      ) : (
        <input
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={sharedClassName}
        />
      )}
      {help ? <span className="text-xs font-semibold text-slate-500">{help}</span> : null}
    </label>
  );
}
