import type { DiagnosticResult, TopicPerformance } from "../types";
import { ProgressBar } from "./ProgressBar";
import { StudyPathCard } from "./StudyPathCard";

interface StudentResultProps {
  result: DiagnosticResult;
  onRetake: () => void;
  onSave: () => void;
  saveFeedback: string;
}

function getTone(performance: TopicPerformance): "success" | "warning" | "danger" {
  if (performance.status === "bom") {
    return "success";
  }

  if (performance.status === "atencao") {
    return "warning";
  }

  return "danger";
}

export function StudentResult({ result, onRetake, onSave, saveFeedback }: StudentResultProps) {
  return (
    <section className="py-10">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <p className="text-sm font-semibold text-teal-700">Resultado do aluno</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
            Sua rota de recuperação
          </h1>
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">
            <p>
              <span className="font-semibold text-slate-800 dark:text-slate-100">Aluno:</span>{" "}
              {result.studentProfile.studentName}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-slate-800 dark:text-slate-100">Curso:</span>{" "}
              {result.studentProfile.courseName}
            </p>
          </div>
          <div className="mt-6 rounded-lg bg-slate-950 p-6 text-white">
            <p className="text-sm text-slate-300">Nota geral</p>
            <p className="mt-2 text-5xl font-semibold">{result.overallPercentage}%</p>
            <p className="mt-2 text-sm text-slate-300">
              {result.correctAnswers} de {result.totalQuestions} respostas corretas
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {result.topicPerformance.map((performance) => (
              <ProgressBar
                key={performance.topicId}
                label={performance.topicName}
                value={performance.percentage}
                tone={getTone(performance)}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-teal-50 p-4 dark:bg-teal-950/30">
              <p className="text-sm font-semibold text-teal-900 dark:text-teal-200">Pontos fortes</p>
              <TopicList items={result.strongTopics} emptyLabel="Ainda sem tópicos acima de 75%." />
            </div>
            <div className="rounded-lg bg-rose-50 p-4 dark:bg-rose-950/30">
              <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">Pontos críticos</p>
              <TopicList items={result.criticalTopics} emptyLabel="Nenhum tópico crítico." />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onRetake}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
            >
              Refazer diagnóstico
            </button>
            <button
              type="button"
              onClick={onSave}
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 dark:focus:ring-offset-slate-950"
            >
              Salvar resultado
            </button>
            {saveFeedback && <span className="text-sm font-medium text-teal-700">{saveFeedback}</span>}
          </div>
        </div>

        <div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
            <p className="text-sm font-semibold text-teal-700">Rota recomendada</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              Prioridade calculada pelo grafo
            </h2>
          </div>
          <div className="mt-5 grid gap-4">
            {result.studyPath.map((item, index) => (
              <StudyPathCard key={item.topicId} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface TopicListProps {
  items: TopicPerformance[];
  emptyLabel: string;
}

function TopicList({ items, emptyLabel }: TopicListProps) {
  if (items.length === 0) {
    return <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{emptyLabel}</p>;
  }

  return (
    <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
      {items.map((item) => (
        <li key={item.topicId}>
          {item.topicName} ({item.percentage}%)
        </li>
      ))}
    </ul>
  );
}
