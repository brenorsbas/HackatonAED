export function AlgorithmExplanation() {
  return (
    <section className="py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <p className="text-sm font-semibold text-teal-700">Como funciona o algoritmo</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
          Do erro do aluno para uma rota objetiva
        </h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            [
              "Grafo de pré-requisitos",
              "O sistema modela os tópicos de Cálculo I como uma lista de adjacência. Assim, Álgebra básica aponta para Funções, Funções aponta para Limites e assim por diante.",
            ],
            [
              "Desempenho por tópico",
              "Cada resposta é agrupada pelo tópico da pergunta. O percentual define domínio bom, atenção ou crítico.",
            ],
            [
              "Pontuação de prioridade",
              "Tópicos com baixo desempenho, alto impacto no grafo e erros em questões difíceis recebem maior prioridade.",
            ],
            [
              "Fila de prioridade",
              "A rota é ordenada por score usando uma fila de prioridade, conectando a solução a conceitos de AED como grafos, listas, tabelas e ordenação.",
            ],
          ].map(([title, text]) => (
            <article key={title} className="rounded-lg bg-slate-50 p-5 dark:bg-slate-950/70">
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-slate-950 p-5 text-white">
          <p className="text-sm font-semibold text-teal-200">Score usado no MVP</p>
          <code className="mt-3 block overflow-x-auto rounded-lg bg-white/10 p-4 text-sm text-slate-100">
            score = erroDoTopico * 0.5 + impactoNoGrafo * 0.3 + dificuldadeMediaErrada * 0.2
          </code>
        </div>
      </div>
    </section>
  );
}
