# Guia do Codigo do CalcPath

Este arquivo explica o que voce precisa saber para apresentar e entender o codigo do CalcPath: estrutura, sintaxe React/TypeScript, logica do diagnostico, grafo e fila de prioridade.

## 1. Visao geral

O CalcPath transforma respostas de um quiz em uma rota de estudos personalizada.

Fluxo principal:

1. O aluno informa nome e curso.
2. O aluno responde o diagnostico.
3. O sistema calcula desempenho geral e por topico.
4. O sistema classifica topicos como bom, atencao ou critico.
5. O sistema gera uma rota com prioridade baseada em erro, grafo e dificuldade.
6. O aluno salva o resultado.
7. O professor ve apenas resultados reais salvos no navegador.

## 2. Estrutura de pastas

```text
src/
  App.tsx
  main.tsx
  components/
    Home.tsx
    StudentForm.tsx
    Quiz.tsx
    StudentResult.tsx
    TeacherDashboard.tsx
    AlgorithmExplanation.tsx
    ProgressBar.tsx
    StudyPathCard.tsx
  data/
    questions.ts
    topics.ts
  lib/
    diagnosticEngine.ts
    priorityQueue.ts
  private/
    CodeGuide.tsx
  types/
    index.ts
```

Responsabilidades:

- `App.tsx`: controla navegacao, tema, localStorage e estado geral.
- `components/`: telas e partes visuais reutilizaveis.
- `data/`: perguntas, topicos e grafo de pre-requisitos.
- `lib/`: algoritmos e regras de negocio.
- `types/`: interfaces TypeScript do projeto.
- `private/`: material privado de estudo, nao importado no app publico.

## 3. Sintaxe importante de React

Um componente React e uma funcao que retorna TSX:

```tsx
interface StudentFormProps {
  onSubmit: (profile: StudentProfile) => void;
}

export function StudentForm({ onSubmit }: StudentFormProps) {
  return <button type="button">Comecar</button>;
}
```

Pontos importantes:

- O nome do componente comeca com letra maiuscula.
- `interface` define o formato das props.
- `return (...)` devolve a interface.
- `className` usa classes Tailwind.
- Eventos como `onClick` e `onSubmit` ligam a UI a funcoes.

## 4. Estado com `useState`

`useState` guarda dados que mudam na tela:

```tsx
const [view, setView] = useState<AppView>("home");
```

Neste exemplo:

- `view` e o valor atual.
- `setView` muda o valor.
- `"home"` e o valor inicial.

No CalcPath, isso controla qual tela aparece: inicio, formulario, quiz, resultado, professor ou algoritmo.

## 5. Efeito com `useEffect`

`useEffect` executa codigo quando o componente carrega ou quando dependencias mudam.

No `App.tsx`, ele carrega o ultimo resultado salvo:

```tsx
useEffect(() => {
  const storedResult = loadStoredResult();

  if (storedResult) {
    setResult(storedResult);
  }
}, []);
```

O array vazio `[]` significa: execute apenas uma vez quando o app abrir.

## 6. Dados locais

As perguntas ficam em `src/data/questions.ts`.

Exemplo:

```ts
{
  id: "q7",
  statement: "Calcule lim x→2 de (x² - 4)/(x - 2).",
  options: ["0", "2", "4", "Não existe"],
  correctOptionIndex: 2,
  topicId: "limites",
  difficulty: "media",
}
```

Campos:

- `id`: identificador unico da pergunta.
- `statement`: enunciado.
- `options`: alternativas.
- `correctOptionIndex`: posicao da alternativa correta.
- `topicId`: topico relacionado.
- `difficulty`: dificuldade usada no score.

## 7. Tipos TypeScript

Os tipos principais ficam em `src/types/index.ts`.

Exemplo:

```ts
export interface StudentProfile {
  studentName: string;
  courseName: string;
}
```

TypeScript ajuda a impedir erros como passar um resultado sem nome do aluno ou usar um topico inexistente.

## 8. Grafo de pre-requisitos

O grafo fica em `src/data/topics.ts` como lista de adjacencia:

```ts
export const topicGraph = {
  "algebra-basica": ["funcoes"],
  funcoes: ["limites", "interpretacao-grafica"],
  limites: ["continuidade", "derivadas"],
  derivadas: ["aplicacoes-derivadas"],
};
```

Como ler:

- `algebra-basica` aponta para `funcoes`.
- Isso significa que algebra e pre-requisito para funcoes.
- Se o aluno vai mal em algebra, isso afeta conteudos posteriores.

Esse e o principal conceito de AED no projeto: representacao de dependencias por grafo.

## 9. Calculo do diagnostico

A funcao principal fica em `src/lib/diagnosticEngine.ts`:

```ts
export function calculateDiagnosticResult(
  answers: StudentAnswer[],
  studentProfile: StudentProfile,
  quizQuestions: Question[] = questions,
): DiagnosticResult
```

Ela faz:

1. Confere cada resposta.
2. Conta acertos totais.
3. Agrupa acertos por topico.
4. Calcula percentuais.
5. Classifica cada topico.
6. Chama `generateStudyPath`.

Regra de classificacao:

```ts
if (percentage > 75) return "bom";
if (percentage >= 50) return "atencao";
return "critico";
```

## 10. Rota adaptativa

A funcao `generateStudyPath` gera a ordem de estudo.

Ela considera tres fatores:

```ts
score =
  erroDoTopico * 0.5 +
  impactoNoGrafo * 0.3 +
  dificuldadeMediaErrada * 0.2;
```

Significado:

- `erroDoTopico`: quanto pior o desempenho, maior a prioridade.
- `impactoNoGrafo`: topicos que sao pre-requisito de muitos outros pesam mais.
- `dificuldadeMediaErrada`: errar questoes dificeis tambem aumenta a prioridade.

Essa formula nao precisa ser perfeita matematicamente; ela precisa ser clara, justificavel e coerente para um MVP academico.

## 11. Fila de prioridade

A fila fica em `src/lib/priorityQueue.ts`.

Ela usa um heap binario simples.

Operacoes principais:

- `enqueue(value, priority)`: adiciona um item.
- `dequeue()`: remove o item com maior prioridade.
- `isEmpty()`: verifica se ainda ha itens.

No CalcPath:

```ts
queue.enqueue(item, priorityScore);

while (!queue.isEmpty()) {
  const item = queue.dequeue();
  path.push(item);
}
```

Isso mostra um conceito classico de AED: ordenar tarefas por prioridade usando estrutura de dados.

## 12. localStorage

O projeto salva dados no navegador:

- `calcpath:theme`: tema claro/escuro.
- `calcpath:student-profile`: ultimo nome/curso preenchido.
- `calcpath:last-result`: ultimo resultado individual.
- `calcpath:class-results`: resultados reais salvos para o professor.

Importante: isso nao e banco de dados. Se abrir em outro computador, os dados nao aparecem.

## 13. Visao do professor

`TeacherDashboard.tsx` recebe resultados reais:

```tsx
<TeacherDashboard results={classResults} />
```

Ela calcula:

- media geral da turma;
- quantidade de alunos avaliados;
- quantidade de alunos em risco;
- ranking dos topicos problematicos;
- recomendacao automatica.

Se nao houver resultado salvo, ela mostra uma mensagem vazia, sem dados ficticios.

## 14. Dark mode

O dark mode usa Tailwind v4 com:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

O `App.tsx` adiciona a classe `dark` quando o usuario ativa o tema escuro:

```tsx
className={`${theme === "dark" ? "dark" : ""} min-h-screen ...`}
```

As classes `dark:` mudam cores no tema escuro:

```tsx
className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
```

## 15. Como apresentar

Uma explicacao curta e boa:

> O CalcPath transforma o erro do aluno em uma rota objetiva de recuperacao. Ele usa um grafo de pre-requisitos para entender o impacto de cada topico, calcula desempenho por conteudo e usa uma fila de prioridade para ordenar o que deve ser estudado primeiro.

Roteiro:

1. Mostre a tela inicial.
2. Preencha nome e curso.
3. Responda algumas perguntas errando topicos importantes.
4. Mostre o resultado por topico.
5. Explique o score de prioridade.
6. Mostre a rota de estudo.
7. Salve o resultado.
8. Abra a visao do professor e mostre que o dado salvo apareceu.

## 16. Comandos uteis

```powershell
npm install
npm run dev
npm test
npm run build
```

Para publicar no GitHub Pages, veja o `README.md`.
