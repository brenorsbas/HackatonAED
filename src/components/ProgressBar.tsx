interface ProgressBarProps {
  value: number;
  label: string;
  tone?: "success" | "warning" | "danger" | "neutral";
}

const toneClasses: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  success: "bg-teal-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  neutral: "bg-slate-500",
};

export function ProgressBar({ value, label, tone = "neutral" }: ProgressBarProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        <span className="tabular-nums text-slate-500 dark:text-slate-400">{normalizedValue}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        aria-label={`${label}: ${normalizedValue}%`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={normalizedValue}
      >
        <div
          className={`h-full rounded-full ${toneClasses[tone]}`}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}
