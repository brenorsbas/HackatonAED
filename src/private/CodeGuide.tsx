/**
 * Componente privado de estudo.
 *
 * Ele nao e importado pelo App.tsx e, por isso, nao aparece no site CalcPath.
 * Para compartilhar com alguem, envie este arquivo ou importe manualmente em
 * uma pagina separada durante uma explicacao tecnica.
 */
interface GuideSection {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
  snippet?: string;
}

const guideSections: GuideSection[] = [
  {
    id: "estrutura",
    title: "1. Estrutura do projeto",
    summary:
      "O CalcPath foi separado por responsabilidade para ficar fácil de explicar, testar e manter.",
    bullets: [
      "components/ guarda as telas e componentes visuais reutilizáveis.",
      "data/ guarda perguntas, tópicos e grafo de pré-requisitos.",
      "lib/ guarda a lógica: cálculo do diagnóstico e fila de prioridade.",
      "types/ guarda os contratos TypeScript usados no app inteiro.",
      "App.tsx coordena qual tela aparece e conecta os eventos principais.",
    ],
    snippet: `src/
  App.tsx
  components/
  data/
  lib/
  types/`,
  },
  {
    id: "tsx",
    title: "2. Sintaxe TSX",
    summary:
      "TSX mistura TypeScript com HTML declarativo. O componente recebe props, calcula dados e retorna interface.",
    bullets: [
      "A função do componente começa com letra maiúscula.",
      "Props são tipadas com interface para evitar uso errado.",
      "className aplica classes Tailwind.",
      "Eventos como onClick chamam funções TypeScript.",
    ],
    snippet: `interface HomeProps {
  onStartDiagnostic: () => void;
}

export function Home({ onStartDiagnostic }: HomeProps) {
  return (
    <button type="button" onClick={onStartDiagnostic}>
      Iniciar diagnóstico
    </button>
  );
}`,
  },
  {
    id: "estado",
    title: "3. Estado e fluxo da tela",
    summary:
      "O estado controla em qual etapa o usuário está: início, quiz, resultado, professor ou explicação.",
    bullets: [
      "useState guarda valores que mudam na interação.",
      "setView troca a tela ativa.",
      "setResult salva o resultado calculado depois do quiz.",
      "useEffect carrega o último resultado salvo no localStorage.",
    ],
    snippet: `const [view, setView] = useState<AppView>("home");
const [result, setResult] = useState<DiagnosticResult | null>(null);

function handleFinishDiagnostic(answers: StudentAnswer[]): void {
  const nextResult = calculateDiagnosticResult(answers);
  setResult(nextResult);
  setView("result");
}`,
  },
  {
    id: "dados",
    title: "4. Dados locais",
    summary:
      "Não existe backend. As perguntas e tópicos são objetos TypeScript locais.",
    bullets: [
      "Cada pergunta tem enunciado, alternativas, resposta correta, tópico e dificuldade.",
      "Cada tópico tem sugestão de estudo e exercícios recomendados.",
      "A visão do professor lê apenas diagnósticos reais salvos no localStorage.",
    ],
    snippet: `{
  id: "q7",
  statement: "Calcule lim x→2 de (x² - 4)/(x - 2).",
  options: ["0", "2", "4", "Não existe"],
  correctOptionIndex: 2,
  topicId: "limites",
  difficulty: "media"
}`,
  },
  {
    id: "grafo",
    title: "5. Grafo de pré-requisitos",
    summary:
      "O grafo mostra quais conteúdos dependem de outros. Foi implementado como lista de adjacência.",
    bullets: [
      "A chave é o tópico atual.",
      "O valor é a lista de tópicos que dependem dele.",
      "Quanto mais tópicos dependem de um assunto, maior o impacto dele na rota.",
    ],
    snippet: `export const topicGraph = {
  "algebra-basica": ["funcoes"],
  funcoes: ["limites", "interpretacao-grafica"],
  limites: ["continuidade", "derivadas"],
  derivadas: ["aplicacoes-derivadas"]
};`,
  },
  {
    id: "diagnostico",
    title: "6. Lógica do diagnóstico",
    summary:
      "Depois do quiz, o motor compara respostas do aluno com as respostas corretas e agrupa por tópico.",
    bullets: [
      "Percentual geral mede o desempenho total.",
      "Percentual por tópico mostra lacunas específicas.",
      "Acima de 75% é bom, entre 50% e 75% é atenção, abaixo de 50% é crítico.",
      "O resultado final alimenta as barras, listas e rota de estudo.",
    ],
    snippet: `function getPerformanceStatus(percentage: number) {
  if (percentage > 75) return "bom";
  if (percentage >= 50) return "atencao";
  return "critico";
}`,
  },
  {
    id: "prioridade",
    title: "7. Score de prioridade",
    summary:
      "A rota não ordena apenas por erro. Ela também considera impacto no grafo e dificuldade das questões erradas.",
    bullets: [
      "erroDoTopico pesa 50%.",
      "impactoNoGrafo pesa 30%.",
      "dificuldadeMediaErrada pesa 20%.",
      "O score gera uma fila de prioridade para decidir o que estudar primeiro.",
    ],
    snippet: `score =
  erroDoTopico * 0.5 +
  impactoNoGrafo * 0.3 +
  dificuldadeMediaErrada * 0.2;`,
  },
  {
    id: "fila",
    title: "8. Fila de prioridade",
    summary:
      "A fila de prioridade é uma estrutura de AED que sempre remove primeiro o item com maior prioridade.",
    bullets: [
      "enqueue adiciona tópico com score.",
      "dequeue remove o tópico de maior score.",
      "O heap binário mantém a estrutura eficiente e organizada.",
      "Isso deixa claro que a rota é calculada, não apenas escrita manualmente.",
    ],
    snippet: `const queue = new PriorityQueue<StudyPathItem>();
queue.enqueue(item, priorityScore);

while (!queue.isEmpty()) {
  path.push(queue.dequeue());
}`,
  },
  {
    id: "apresentacao",
    title: "9. Como explicar na apresentação",
    summary:
      "A frase central do projeto é: o CalcPath transforma o erro do aluno em rota objetiva de recuperação.",
    bullets: [
      "Mostre o quiz como entrada de dados.",
      "Mostre o resultado como tabela de desempenho por tópico.",
      "Explique o grafo como dependência entre conteúdos.",
      "Explique o score como critério de priorização.",
      "Mostre a visão da turma como apoio ao professor.",
    ],
  },
];

const keyFiles = [
  ["App.tsx", "controla navegação, resultado e localStorage"],
  ["questions.ts", "contém as perguntas do diagnóstico"],
  ["topics.ts", "contém tópicos, sugestões e grafo"],
  ["diagnosticEngine.ts", "calcula desempenho e rota adaptativa"],
  ["priorityQueue.ts", "implementa a fila de prioridade com heap"],
];

export function CodeGuide() {
  return (
    <section className="py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-teal-700">Guia do Código</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          Entenda a sintaxe, a lógica e a parte de AED
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Esta seção foi feita para você estudar o próprio CalcPath. Ela resume o que cada parte do
          código faz e como explicar a implementação para a banca ou para a turma.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {keyFiles.map(([fileName, description]) => (
            <article key={fileName} className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">{fileName}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        {guideSections.map((section) => (
          <article key={section.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{section.summary}</p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {section.snippet ? (
                <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                  <code>{section.snippet}</code>
                </pre>
              ) : (
                <div className="rounded-lg bg-teal-50 p-5 text-sm leading-6 text-teal-900">
                  Dica: durante a apresentação, abra o app, faça o diagnóstico com alguns erros
                  intencionais e mostre como a rota muda de acordo com os tópicos mais frágeis.
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
