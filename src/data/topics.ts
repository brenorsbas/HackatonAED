import type { Topic, TopicId } from "../types";

export const topics: Topic[] = [
  {
    id: "algebra-basica",
    name: "Algebra basica",
    description: "Manipulacao simbolica, fatoracao, potencias e fracoes algebricas.",
    studySuggestion: "Revise fatoracao, produtos notaveis, potencias e simplificacao de fracoes.",
    recommendedExercises: [
      "Fatore x² - 9 e simplifique (x² - 9)/(x - 3).",
      "Resolva 2x - 5 = 3x + 1.",
      "Simplifique (a³b²)/(ab⁵), com a e b diferentes de zero.",
    ],
  },
  {
    id: "funcoes",
    name: "Funcoes",
    description: "Dominio, imagem, composicao, inversa e comportamento de funcoes.",
    studySuggestion: "Revise dominio, imagem, composicao e leitura de expressoes funcionais.",
    recommendedExercises: [
      "Determine o dominio de f(x) = 1/(x - 2).",
      "Calcule (f ∘ g)(x) para f(x)=x² e g(x)=x+1.",
      "Identifique se f(x)=2x+3 possui inversa e encontre f⁻¹(x).",
    ],
  },
  {
    id: "trigonometria",
    name: "Trigonometria",
    description: "Seno, cosseno, tangente, identidades e angulos notaveis.",
    studySuggestion: "Revise circulo trigonometrico, identidades fundamentais e angulos notaveis.",
    recommendedExercises: [
      "Calcule sen(pi/6), cos(pi/3) e tg(pi/4).",
      "Use sen²(x)+cos²(x)=1 para simplificar expressões.",
      "Resolva cos(x)=0 no intervalo [0, 2pi].",
    ],
  },
  {
    id: "limites",
    name: "Limites",
    description: "Comportamento local, limites laterais e formas indeterminadas simples.",
    studySuggestion: "Revise limites por substituicao, fatoracao, limites laterais e comportamento grafico.",
    recommendedExercises: [
      "Calcule lim x→2 de (x² - 4)/(x - 2).",
      "Analise os limites laterais de uma função definida por partes.",
      "Estime um limite a partir de uma tabela de valores.",
    ],
  },
  {
    id: "continuidade",
    name: "Continuidade",
    description: "Condicoes para continuidade, descontinuidades removiveis e saltos.",
    studySuggestion: "Revise as tres condicoes de continuidade e exemplos de funcoes por partes.",
    recommendedExercises: [
      "Verifique se f(x)=x² é contínua em x=1.",
      "Classifique a descontinuidade de f(x)=(x²-1)/(x-1) em x=1.",
      "Ajuste uma constante para tornar uma função por partes contínua.",
    ],
  },
  {
    id: "derivadas",
    name: "Derivadas",
    description: "Taxa de variacao, reta tangente e regras basicas de derivacao.",
    studySuggestion: "Revise definicao de derivada, regra da potencia, produto, quociente e cadeia.",
    recommendedExercises: [
      "Derive f(x)=3x⁴ - 2x + 7.",
      "Encontre a inclinação da tangente de f(x)=x² em x=3.",
      "Derive h(x)=(2x+1)⁵ usando regra da cadeia.",
    ],
  },
  {
    id: "aplicacoes-derivadas",
    name: "Aplicacoes de derivadas",
    description: "Crescimento, decrescimento, extremos, otimização e interpretação física.",
    studySuggestion: "Revise pontos críticos, sinais da derivada e problemas de otimização simples.",
    recommendedExercises: [
      "Encontre os pontos críticos de f(x)=x³-3x.",
      "Use a derivada para identificar intervalos de crescimento.",
      "Modele uma area maxima com perimetro fixo.",
    ],
  },
  {
    id: "interpretacao-grafica",
    name: "Interpretacao grafica",
    description: "Leitura de graficos, inclinacao, assintotas e relacao grafico-expressao.",
    studySuggestion: "Revise leitura de interceptos, crescimento, concavidade e limites no grafico.",
    recommendedExercises: [
      "Identifique zeros, maximos e minimos em um grafico.",
      "Estime a derivada em um ponto pela inclinacao da tangente.",
      "Determine limites laterais observando o comportamento do grafico.",
    ],
  },
];

export const topicGraph: Record<TopicId, TopicId[]> = {
  "algebra-basica": ["funcoes"],
  funcoes: ["limites", "interpretacao-grafica"],
  trigonometria: ["limites"],
  limites: ["continuidade", "derivadas"],
  continuidade: ["derivadas"],
  derivadas: ["aplicacoes-derivadas"],
  "aplicacoes-derivadas": [],
  "interpretacao-grafica": ["limites", "derivadas"],
};
