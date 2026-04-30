interface HomeProps {
  onStartDiagnostic: () => void;
  onOpenTeacherDashboard: () => void;
}

export function Home({ onStartDiagnostic, onOpenTeacherDashboard }: HomeProps) {
  return (
    <>
      <section className="grid items-center gap-10 py-10 lg:min-h-[640px] lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-slate-950 md:text-6xl dark:text-white">
            CalcPath
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-medium text-teal-700 dark:text-teal-300">
            Diagnóstico inteligente e rota adaptativa para Cálculo I
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Muitos alunos chegam em Cálculo I com lacunas em pré-requisitos como álgebra,
            funções e trigonometria. O CalcPath identifica essas lacunas e monta uma rota
            objetiva de recuperação.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onStartDiagnostic}
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300 dark:focus:ring-offset-slate-950"
            >
              Iniciar diagnóstico
            </button>
            <button
              type="button"
              onClick={onOpenTeacherDashboard}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300 dark:focus:ring-offset-slate-950"
            >
              Visão da Turma
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-950/30">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                Fluxo do diagnóstico
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dados reais aparecem após salvar o resultado
              </p>
            </div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
              AED aplicado
            </span>
          </div>
          <div className="mt-5 grid gap-4">
            <div className="rounded-lg bg-slate-950 p-5 text-white">
              <p className="text-sm text-slate-300">Entrada</p>
              <p className="mt-2 text-2xl font-semibold">Nome, curso e respostas</p>
              <p className="mt-2 text-sm text-slate-300">
                O aluno se identifica antes do quiz e responde questões de Cálculo I.
              </p>
            </div>
            {[
              ["1", "Coleta", "O quiz registra respostas reais por tópico."],
              ["2", "Análise", "O motor calcula desempenho geral e por conteúdo."],
              ["3", "Grafo", "Pré-requisitos aumentam a prioridade da rota."],
              ["4", "Professor", "A turma mostra apenas resultados salvos."],
            ].map(([step, label, description]) => (
              <div
                key={step}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 dark:bg-teal-400/15 dark:text-teal-200">
                    {step}
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-white">{label}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              </div>
            ))}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-950/30">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Importante</p>
              <p className="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-100">
                A visão do professor fica vazia até um aluno salvar um diagnóstico real.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 pb-10 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <p className="text-sm font-semibold text-slate-950 dark:text-white">Para professores</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              ["Fonte", "localStorage"],
              ["Dados", "reais"],
              ["Modo", "sem demo"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950/70">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <p className="text-sm font-semibold text-slate-950 dark:text-white">
            Como o CalcPath funciona
          </p>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-4 dark:text-slate-300">
            {["Diagnóstico", "Grafo", "Score", "Rota"].map((step, index) => (
              <div key={step} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950/70">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 dark:bg-teal-400/15 dark:text-teal-200">
                  {index + 1}
                </span>
                <p className="mt-3 font-semibold text-slate-900 dark:text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
