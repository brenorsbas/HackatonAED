import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AlgorithmExplanation } from "./components/AlgorithmExplanation";
import { Home } from "./components/Home";
import { Quiz } from "./components/Quiz";
import { StudentForm } from "./components/StudentForm";
import { StudentResult } from "./components/StudentResult";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { calculateDiagnosticResult } from "./lib/diagnosticEngine";
import type { DiagnosticResult, StudentAnswer, StudentProfile } from "./types";

type AppView = "home" | "student-form" | "quiz" | "result" | "teacher" | "algorithm";
type Theme = "light" | "dark";

const STORAGE_KEY = "calcpath:last-result";
const PROFILE_STORAGE_KEY = "calcpath:student-profile";
const CLASS_RESULTS_STORAGE_KEY = "calcpath:class-results";
const THEME_STORAGE_KEY = "calcpath:theme";
const EMPTY_PROFILE: StudentProfile = {
  studentName: "",
  courseName: "",
};

export default function App() {
  const [view, setView] = useState<AppView>("home");
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => loadStoredProfile());
  const [classResults, setClassResults] = useState<DiagnosticResult[]>(() => loadClassResults());
  const [saveFeedback, setSaveFeedback] = useState("");
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    const storedResult = loadStoredResult();

    if (storedResult) {
      setResult(storedResult);
    }
  }, []);

  const visibleView = useMemo(() => {
    if (view === "result" && !result) {
      return "home";
    }

    return view;
  }, [result, view]);

  function handleFinishDiagnostic(answers: StudentAnswer[]): void {
    const nextResult = calculateDiagnosticResult(answers, studentProfile);
    setResult(nextResult);
    saveResult(nextResult);
    setSaveFeedback("Resultado salvo automaticamente para a visão do professor.");
    setView("result");
  }

  function saveResult(nextResult: DiagnosticResult): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResult));
    const nextClassResults = upsertClassResult(classResults, nextResult);
    setClassResults(nextClassResults);
    localStorage.setItem(CLASS_RESULTS_STORAGE_KEY, JSON.stringify(nextClassResults));
  }

  function handleStartDiagnostic(): void {
    setSaveFeedback("");
    setView("student-form");
  }

  function handleSubmitProfile(profile: StudentProfile): void {
    setStudentProfile(profile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setView("quiz");
  }

  function handleToggleTheme(): void {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  }

  function handleDeleteResult(resultId: string): void {
    const nextClassResults = classResults.filter((item) => item.id !== resultId);
    setClassResults(nextClassResults);
    localStorage.setItem(CLASS_RESULTS_STORAGE_KEY, JSON.stringify(nextClassResults));

    if (result?.id === resultId) {
      setResult(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.10),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.13),transparent_34%),linear-gradient(180deg,#08111f_0%,#111827_100%)] dark:text-slate-100`}
    >
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Ir para a tela inicial do CalcPath"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-sm font-bold text-white">
              CP
            </span>
            <span className="text-lg font-semibold text-slate-950 dark:text-white">CalcPath</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <NavButton active={visibleView === "home"} onClick={() => setView("home")}>
              Início
            </NavButton>
            <NavButton
              active={visibleView === "student-form" || visibleView === "quiz"}
              onClick={handleStartDiagnostic}
            >
              Diagnóstico
            </NavButton>
            <NavButton active={visibleView === "teacher"} onClick={() => setView("teacher")}>
              Visão da Turma
            </NavButton>
            <NavButton active={visibleView === "algorithm"} onClick={() => setView("algorithm")}>
              Como funciona
            </NavButton>
            <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5">
        {visibleView === "home" && (
          <Home
            onStartDiagnostic={handleStartDiagnostic}
            onOpenTeacherDashboard={() => setView("teacher")}
          />
        )}
        {visibleView === "student-form" && (
          <StudentForm
            initialProfile={studentProfile}
            onSubmit={handleSubmitProfile}
            onCancel={() => setView("home")}
          />
        )}
        {visibleView === "quiz" && (
          <Quiz onFinish={handleFinishDiagnostic} onCancel={() => setView("home")} />
        )}
        {visibleView === "result" && result && (
          <StudentResult
            result={result}
            onRetake={handleStartDiagnostic}
            saveFeedback={saveFeedback}
          />
        )}
        {visibleView === "teacher" && (
          <TeacherDashboard
            results={classResults}
            onDeleteResult={handleDeleteResult}
            onStartDiagnostic={handleStartDiagnostic}
          />
        )}
        {visibleView === "algorithm" && <AlgorithmExplanation />}
      </main>
    </div>
  );
}

function NavButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
        active
          ? "bg-slate-950 text-white dark:bg-teal-400 dark:text-slate-950"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:border-teal-300 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 15.3A8.5 8.5 0 0 1 8.7 4 7.2 7.2 0 1 0 20 15.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function loadStoredResult(): DiagnosticResult | null {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    const parsedValue = storedValue ? (JSON.parse(storedValue) as DiagnosticResult) : null;
    return parsedValue?.studentProfile ? parsedValue : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function loadStoredProfile(): StudentProfile {
  try {
    const storedValue = localStorage.getItem(PROFILE_STORAGE_KEY);
    const parsedValue = storedValue ? (JSON.parse(storedValue) as StudentProfile) : null;

    if (parsedValue?.studentName && parsedValue?.courseName) {
      return parsedValue;
    }
  } catch {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  }

  return EMPTY_PROFILE;
}

function loadClassResults(): DiagnosticResult[] {
  try {
    const storedValue = localStorage.getItem(CLASS_RESULTS_STORAGE_KEY);
    const parsedValue = storedValue ? (JSON.parse(storedValue) as DiagnosticResult[]) : [];
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item) => item.studentProfile?.studentName && item.studentProfile?.courseName)
      : [];
  } catch {
    localStorage.removeItem(CLASS_RESULTS_STORAGE_KEY);
    return [];
  }
}

function upsertClassResult(
  currentResults: DiagnosticResult[],
  nextResult: DiagnosticResult,
): DiagnosticResult[] {
  const existingIndex = currentResults.findIndex((item) => item.id === nextResult.id);

  if (existingIndex === -1) {
    return [nextResult, ...currentResults];
  }

  return currentResults.map((item) => (item.id === nextResult.id ? nextResult : item));
}

function getInitialTheme(): Theme {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch {
    return "light";
  }

  return "light";
}
