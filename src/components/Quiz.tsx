import { useState } from "react";
import { questions } from "../data/questions";
import type { StudentAnswer } from "../types";

interface QuizProps {
  onFinish: (answers: StudentAnswer[]) => void;
  onCancel: () => void;
}

export function Quiz({ onFinish, onCancel }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useQuizIndex();
  const [answers, setAnswers] = useQuizAnswers();
  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionIndex = answers[currentQuestion.id]?.selectedOptionIndex;
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  function handleSelectOption(optionIndex: number): void {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOptionIndex: optionIndex,
      },
    }));
  }

  function handleNext(): void {
    if (currentQuestionIndex === questions.length - 1) {
      onFinish(Object.values(answers));
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  }

  function handlePrevious(): void {
    setCurrentQuestionIndex((index) => Math.max(index - 1, 0));
  }

  return (
    <section className="mx-auto max-w-4xl py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-950/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-700">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
              Diagnóstico CalcPath
            </h1>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
          >
            Sair
          </button>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-teal-500" style={{ width: `${progressPercentage}%` }} />
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {currentQuestion.topicId.replace("-", " ")}
            </span>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
              dificuldade {currentQuestion.difficulty}
            </span>
          </div>
          <h2 className="mt-5 text-2xl font-semibold leading-snug text-slate-950 dark:text-white">
            {currentQuestion.statement}
          </h2>
        </div>

        <div className="mt-6 grid gap-3">
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = selectedOptionIndex === optionIndex;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(optionIndex)}
                className={`rounded-lg border p-4 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isSelected
                    ? "border-teal-400 bg-teal-50 text-teal-950 dark:bg-teal-400/15 dark:text-teal-100"
                    : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:border-teal-500/50 dark:hover:bg-slate-800"
                }`}
                aria-pressed={isSelected}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedOptionIndex === undefined}
            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
          >
            {currentQuestionIndex === questions.length - 1 ? "Ver resultado" : "Próxima"}
          </button>
        </div>
      </div>
    </section>
  );
}

function useQuizIndex() {
  const state = useState(0);
  return state;
}

function useQuizAnswers() {
  const state = useState<Record<string, StudentAnswer>>({});
  return state;
}
