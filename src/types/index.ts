export type TopicId =
  | "algebra-basica"
  | "funcoes"
  | "trigonometria"
  | "limites"
  | "continuidade"
  | "derivadas"
  | "aplicacoes-derivadas"
  | "interpretacao-grafica";

export type Difficulty = "facil" | "media" | "dificil";
export type PerformanceStatus = "bom" | "atencao" | "critico";
export type Urgency = "alta" | "media" | "baixa";

export interface Topic {
  id: TopicId;
  name: string;
  description: string;
  studySuggestion: string;
  recommendedExercises: string[];
}

export interface Question {
  id: string;
  statement: string;
  options: string[];
  correctOptionIndex: number;
  topicId: TopicId;
  difficulty: Difficulty;
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionIndex: number;
}

export interface StudentProfile {
  studentName: string;
  courseName: string;
}

export interface TopicPerformance {
  topicId: TopicId;
  topicName: string;
  correct: number;
  total: number;
  percentage: number;
  status: PerformanceStatus;
}

export interface StudyPathItem {
  topicId: TopicId;
  topicName: string;
  reason: string;
  urgency: Urgency;
  suggestion: string;
  recommendedExercises: string[];
  priorityScore: number;
}

export interface DiagnosticResult {
  id: string;
  createdAt: string;
  studentProfile: StudentProfile;
  totalQuestions: number;
  correctAnswers: number;
  overallPercentage: number;
  topicPerformance: TopicPerformance[];
  strongTopics: TopicPerformance[];
  weakTopics: TopicPerformance[];
  criticalTopics: TopicPerformance[];
  studyPath: StudyPathItem[];
}
