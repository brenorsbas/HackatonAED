import { useState, type FormEvent } from "react";
import type { StudentProfile } from "../types";

interface StudentFormProps {
  initialProfile: StudentProfile;
  onSubmit: (profile: StudentProfile) => void;
  onCancel: () => void;
}

export function StudentForm({ initialProfile, onSubmit, onCancel }: StudentFormProps) {
  const [studentName, setStudentName] = useState(initialProfile.studentName);
  const [courseName, setCourseName] = useState(initialProfile.courseName);

  const trimmedName = studentName.trim();
  const trimmedCourse = courseName.trim();
  const canSubmit = trimmedName.length >= 2 && trimmedCourse.length >= 2;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit({
      studentName: trimmedName,
      courseName: trimmedCourse,
    });
  }

  return (
    <section className="mx-auto max-w-3xl py-10">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-950/30"
      >
        <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
          Antes do diagnóstico
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
          Identificação do aluno
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Esses dados serão gravados junto com os resultados de outro alunos para analise do
          professor.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Nome do aluno
            <input
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              placeholder="Ex.: Maria Souza"
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
              autoComplete="name"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Curso
            <input
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              placeholder="Ex.: Engenharia Civil"
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
              autoComplete="organization-title"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
          >
            Começar diagnóstico
          </button>
        </div>
      </form>
    </section>
  );
}
