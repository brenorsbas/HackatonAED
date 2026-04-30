import { questions } from "../data/questions";
import type { StudentAnswer } from "../types";
import { calculateDiagnosticResult, generateStudyPath } from "./diagnosticEngine";

const studentProfile = {
  studentName: "Aluno Teste",
  courseName: "Engenharia",
};

function answerAllCorrect(): StudentAnswer[] {
  return questions.map((question) => ({
    questionId: question.id,
    selectedOptionIndex: question.correctOptionIndex,
  }));
}

describe("diagnosticEngine", () => {
  it("calcula desempenho geral e classifica topicos fortes", () => {
    const result = calculateDiagnosticResult(answerAllCorrect(), studentProfile);

    expect(result.overallPercentage).toBe(100);
    expect(result.correctAnswers).toBe(questions.length);
    expect(result.criticalTopics).toHaveLength(0);
    expect(result.strongTopics.length).toBeGreaterThan(0);
  });

  it("identifica topicos criticos quando todas as respostas de um topico estao erradas", () => {
    const answers = answerAllCorrect().map((answer) => {
      const question = questions.find((item) => item.id === answer.questionId);

      if (question?.topicId === "limites") {
        return {
          ...answer,
          selectedOptionIndex: (question.correctOptionIndex + 1) % question.options.length,
        };
      }

      return answer;
    });

    const result = calculateDiagnosticResult(answers, studentProfile);
    const limites = result.topicPerformance.find((topic) => topic.topicId === "limites");

    expect(limites?.percentage).toBe(0);
    expect(limites?.status).toBe("critico");
    expect(result.criticalTopics.map((topic) => topic.topicId)).toContain("limites");
  });

  it("prioriza topicos com erro alto e impacto no grafo", () => {
    const topicPerformance = [
      {
        topicId: "algebra-basica" as const,
        topicName: "Algebra basica",
        correct: 0,
        total: 2,
        percentage: 0,
        status: "critico" as const,
      },
      {
        topicId: "aplicacoes-derivadas" as const,
        topicName: "Aplicacoes de derivadas",
        correct: 0,
        total: 2,
        percentage: 0,
        status: "critico" as const,
      },
    ];
    const answers = questions
      .filter(
        (question) =>
          question.topicId === "algebra-basica" || question.topicId === "aplicacoes-derivadas",
      )
      .map((question) => ({
        questionId: question.id,
        selectedOptionIndex: (question.correctOptionIndex + 1) % question.options.length,
      }));

    const path = generateStudyPath(topicPerformance, answers);

    expect(path[0]?.topicId).toBe("algebra-basica");
    expect(path[0]?.priorityScore).toBeGreaterThan(path[1]?.priorityScore ?? 0);
  });

  it("lança erro claro quando o quiz não possui perguntas", () => {
    expect(() => calculateDiagnosticResult([], studentProfile, [])).toThrow(
      "Nao ha perguntas cadastradas para o diagnostico.",
    );
  });
});
