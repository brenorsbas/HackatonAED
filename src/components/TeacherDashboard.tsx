import { topics } from "../data/topics";
import type { DiagnosticResult, TopicId } from "../types";
import { ProgressBar } from "./ProgressBar";

interface TeacherDashboardProps {
  results: DiagnosticResult[];
  onStartDiagnostic: () => void;
}

interface ProblemTopic {
  topicId: TopicId;
  topicName: string;
  average: number;
}

export function TeacherDashboard({ results, onStartDiagnostic }: TeacherDashboardProps) {
  const hasResults = results.length > 0;
  const classAverage = hasResults
    ? Math.round(results.reduce((sum, result) => sum + result.overallPercentage, 0) / results.length)
    : 0;
  const studentsAtRisk = results.filter((result) => result.overallPercentage < 50).length;
  const problemTopics = getProblemTopics(results);
  const topDifficulties = problemTopics.slice(0, 3);
  const recommendation = getTeacherRecommendation(topDifficulties);

  return (
    <section className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-teal-700">Visão da Turma</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
            Painel do professor
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Esta visão usa apenas resultados reais salvos neste navegador. Sem simulação e sem
            backend.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartDiagnostic}
          className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 dark:focus:ring-offset-slate-950"
        >
          Iniciar diagnóstico
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <MetricCard label="Média geral" value={hasResults ? `${classAverage}%` : "0%"} detail="Resultados salvos" />
        <MetricCard label="Alunos avaliados" value={String(results.length)} detail="Registros reais" />
        <MetricCard label="Alunos em risco" value={String(studentsAtRisk)} detail="Abaixo de 50%" />
      </div>

      {!hasResults ? (
        <EmptyTeacherState onStartDiagnostic={onStartDiagnostic} />
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              Ranking dos tópicos problemáticos
            </h2>
            <div className="mt-5 grid gap-4">
              {problemTopics.map((topic) => (
                <ProgressBar
                  key={topic.topicId}
                  label={topic.topicName}
                  value={topic.average}
                  tone={topic.average < 50 ? "danger" : "warning"}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              Recomendação automática
            </h2>
            <p className="mt-4 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
              {recommendation}
            </p>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Resultados salvos
              </p>
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Aluno</th>
                      <th className="px-4 py-3 font-semibold">Curso</th>
                      <th className="px-4 py-3 font-semibold">Média</th>
                      <th className="px-4 py-3 font-semibold">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                          {result.studentProfile.studentName}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {result.studentProfile.courseName}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {result.overallPercentage}%
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {formatDate(result.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
    </article>
  );
}

function EmptyTeacherState({ onStartDiagnostic }: { onStartDiagnostic: () => void }) {
  return (
    <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
      <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
        Nenhum resultado real salvo ainda
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
        Peça para um aluno preencher nome e curso, concluir o diagnóstico e clicar em “Salvar
        resultado”. Depois disso, os dados aparecerão neste painel.
      </p>
      <button
        type="button"
        onClick={onStartDiagnostic}
        className="mt-5 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 dark:focus:ring-offset-slate-950"
      >
        Fazer primeiro diagnóstico
      </button>
    </div>
  );
}

function getProblemTopics(results: DiagnosticResult[]): ProblemTopic[] {
  if (results.length === 0) {
    return [];
  }

  return topics
    .map((topic) => {
      const average = Math.round(
        results.reduce((sum, result) => {
          const topicResult = result.topicPerformance.find((item) => item.topicId === topic.id);
          return sum + (topicResult?.percentage ?? 0);
        }, 0) / results.length,
      );

      return {
        topicId: topic.id,
        topicName: topic.name,
        average,
      };
    })
    .sort((first, second) => first.average - second.average);
}

function getTeacherRecommendation(problemTopics: ProblemTopic[]): string {
  const firstTopic = problemTopics[0]?.topicName;
  const secondTopic = problemTopics[1]?.topicName;

  if (!firstTopic) {
    return "Ainda não há dados reais suficientes para gerar uma recomendação.";
  }

  if (!secondTopic) {
    return `A turma apresenta maior dificuldade em ${firstTopic}. Recomenda-se uma revisão direcionada antes de avançar.`;
  }

  return `A turma apresenta maior dificuldade em ${firstTopic} e ${secondTopic}. Recomenda-se uma revisão direcionada antes de avançar para derivadas.`;
}

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}
