import type { StudyPathItem } from "../types";

interface StudyPathCardProps {
  item: StudyPathItem;
  index: number;
}

const urgencyStyles: Record<StudyPathItem["urgency"], string> = {
  alta: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-200",
  media:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200",
  baixa: "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-500/30 dark:bg-teal-950/30 dark:text-teal-200",
};

export function StudyPathCard({ item, index }: StudyPathCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
            Etapa {index + 1}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
            {item.topicName}
          </h3>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${urgencyStyles[item.urgency]}`}
        >
          Urgência {item.urgency}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.reason}</p>

      <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-950/70">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Sugestão</p>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {item.suggestion}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Exercícios recomendados
        </p>
        <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {item.recommendedExercises.map((exercise) => (
            <li key={exercise} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span>{exercise}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
