import { questions } from "../data/questions";
import { topicGraph, topics } from "../data/topics";
import type {
  DiagnosticResult,
  Difficulty,
  PerformanceStatus,
  Question,
  StudentAnswer,
  StudentProfile,
  StudyPathItem,
  Topic,
  TopicId,
  TopicPerformance,
  Urgency,
} from "../types";
import { PriorityQueue } from "./priorityQueue";

const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  facil: 0.35,
  media: 0.65,
  dificil: 1,
};

const topicById = new Map<TopicId, Topic>(topics.map((topic) => [topic.id, topic]));

function getPerformanceStatus(percentage: number): PerformanceStatus {
  if (percentage > 75) {
    return "bom";
  }

  if (percentage >= 50) {
    return "atencao";
  }

  return "critico";
}

function calculateDownstreamImpact(topicId: TopicId, visited = new Set<TopicId>()): number {
  const nextTopics = topicGraph[topicId] ?? [];

  for (const nextTopic of nextTopics) {
    if (!visited.has(nextTopic)) {
      visited.add(nextTopic);
      calculateDownstreamImpact(nextTopic, visited);
    }
  }

  return visited.size;
}

function getDifficultyAverage(wrongQuestions: Question[]): number {
  if (wrongQuestions.length === 0) {
    return 0;
  }

  const totalWeight = wrongQuestions.reduce(
    (sum, question) => sum + DIFFICULTY_WEIGHT[question.difficulty],
    0,
  );

  return totalWeight / wrongQuestions.length;
}

function getUrgency(priorityScore: number, status: PerformanceStatus): Urgency {
  if (status === "critico" || priorityScore >= 0.68) {
    return "alta";
  }

  if (status === "atencao" || priorityScore >= 0.42) {
    return "media";
  }

  return "baixa";
}

function buildPriorityReason(
  topic: Topic,
  performance: TopicPerformance,
  impact: number,
  wrongQuestions: Question[],
): string {
  const impactedTopics = topicGraph[topic.id]
    .map((nextTopicId) => topicById.get(nextTopicId)?.name)
    .filter(Boolean)
    .join(", ");
  const missedDifficulty = wrongQuestions.some((question) => question.difficulty === "dificil")
    ? "incluindo questoes dificeis"
    : "em questoes de base";

  if (performance.status === "critico") {
    return `Voce acertou ${performance.percentage}% em ${topic.name}, ${missedDifficulty}. Esse topico impacta ${impact} topico(s) no grafo${impactedTopics ? `, como ${impactedTopics}` : ""}.`;
  }

  if (performance.status === "atencao") {
    return `Seu desempenho ficou em zona de atencao (${performance.percentage}%). Reforcar ${topic.name} evita dificuldades nos proximos topicos${impactedTopics ? `: ${impactedTopics}` : ""}.`;
  }

  return `${topic.name} esta relativamente dominado, mas aparece na rota como consolidacao por ter conexoes importantes no grafo.`;
}

/**
 * Gera uma rota adaptativa usando erro do topico, impacto no grafo e dificuldade media errada.
 *
 * score = erroDoTopico * 0.5 + impactoNoGrafo * 0.3 + dificuldadeMediaErrada * 0.2
 */
export function generateStudyPath(
  topicPerformance: TopicPerformance[],
  answers: StudentAnswer[],
  quizQuestions: Question[] = questions,
): StudyPathItem[] {
  const answeredByQuestionId = new Map(answers.map((answer) => [answer.questionId, answer]));
  const maxImpact = Math.max(...topics.map((topic) => calculateDownstreamImpact(topic.id)), 1);
  const queue = new PriorityQueue<StudyPathItem>();

  for (const performance of topicPerformance) {
    const topic = topicById.get(performance.topicId);

    if (!topic) {
      continue;
    }

    const topicQuestions = quizQuestions.filter((question) => question.topicId === topic.id);
    const wrongQuestions = topicQuestions.filter((question) => {
      const answer = answeredByQuestionId.get(question.id);
      return answer && answer.selectedOptionIndex !== question.correctOptionIndex;
    });

    const errorRatio = 1 - performance.percentage / 100;
    const normalizedImpact = calculateDownstreamImpact(topic.id) / maxImpact;
    const averageWrongDifficulty = getDifficultyAverage(wrongQuestions);
    const priorityScore =
      errorRatio * 0.5 + normalizedImpact * 0.3 + averageWrongDifficulty * 0.2;

    if (performance.status === "bom" && priorityScore < 0.35) {
      continue;
    }

    const item: StudyPathItem = {
      topicId: topic.id,
      topicName: topic.name,
      reason: buildPriorityReason(
        topic,
        performance,
        calculateDownstreamImpact(topic.id),
        wrongQuestions,
      ),
      urgency: getUrgency(priorityScore, performance.status),
      suggestion: topic.studySuggestion,
      recommendedExercises: topic.recommendedExercises.slice(0, 3),
      priorityScore: Number(priorityScore.toFixed(3)),
    };

    queue.enqueue(item, priorityScore);
  }

  const path: StudyPathItem[] = [];

  while (!queue.isEmpty()) {
    const item = queue.dequeue();

    if (item) {
      path.push(item);
    }
  }

  return path.slice(0, 6);
}

export function calculateDiagnosticResult(
  answers: StudentAnswer[],
  studentProfile: StudentProfile,
  quizQuestions: Question[] = questions,
): DiagnosticResult {
  if (quizQuestions.length === 0) {
    throw new Error("Nao ha perguntas cadastradas para o diagnostico.");
  }

  const answerMap = new Map(answers.map((answer) => [answer.questionId, answer]));
  const correctAnswers = quizQuestions.filter(
    (question) => answerMap.get(question.id)?.selectedOptionIndex === question.correctOptionIndex,
  ).length;

  const topicPerformance = topics.map<TopicPerformance>((topic) => {
    const topicQuestions = quizQuestions.filter((question) => question.topicId === topic.id);
    const topicCorrect = topicQuestions.filter(
      (question) => answerMap.get(question.id)?.selectedOptionIndex === question.correctOptionIndex,
    ).length;
    const percentage =
      topicQuestions.length > 0 ? Math.round((topicCorrect / topicQuestions.length) * 100) : 0;

    return {
      topicId: topic.id,
      topicName: topic.name,
      correct: topicCorrect,
      total: topicQuestions.length,
      percentage,
      status: getPerformanceStatus(percentage),
    };
  });

  const strongTopics = topicPerformance.filter((topic) => topic.status === "bom");
  const weakTopics = topicPerformance.filter((topic) => topic.status === "atencao");
  const criticalTopics = topicPerformance.filter((topic) => topic.status === "critico");

  return {
    id: createResultId(),
    createdAt: new Date().toISOString(),
    studentProfile,
    totalQuestions: quizQuestions.length,
    correctAnswers,
    overallPercentage: Math.round((correctAnswers / quizQuestions.length) * 100),
    topicPerformance,
    strongTopics,
    weakTopics,
    criticalTopics,
    studyPath: generateStudyPath(topicPerformance, answers, quizQuestions),
  };
}

function createResultId(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `result-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
