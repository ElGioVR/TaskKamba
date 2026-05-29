import type { User } from "firebase/auth";
import { DailyStreakCard } from "./DailyStreakCard";
import { Metric } from "./Metric";
import { WeeklyActivityChart } from "./WeeklyActivityChart";
import type { ActivityRange, DailyStreak } from "../model";

type TaskBoardHeaderProps = {
  activityRange: ActivityRange;
  dailyStreak: DailyStreak;
  totals: {
    active: number;
    done: number;
    high: number;
  };
  user: User | null;
  weeklyActivity: Array<{ key: string; label: string; count: number }>;
  onActivityRangeChange: (range: ActivityRange) => void;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
};

export function TaskBoardHeader({
  activityRange,
  dailyStreak,
  totals,
  user,
  weeklyActivity,
  onActivityRangeChange,
  onLogin,
  onLogout,
}: TaskBoardHeaderProps) {
  return (
    <header className="border-b border-slate-950/15 bg-[#f4f0e8]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 lg:px-10">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-sm bg-slate-950 text-sm font-black text-white">
              G
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">
                Gio Tasks
              </p>
              <p className="text-xs text-slate-600">
                Kanban personal con Firebase
              </p>
            </div>
          </div>

          {user ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-sm border border-slate-950/20 bg-white px-3 py-2 text-sm">
                {user.displayName || user.email}
              </div>
              <button
                className="rounded-sm border border-slate-950 px-4 py-2 text-sm font-black transition hover:bg-slate-950 hover:text-white"
                onClick={onLogout}
                type="button"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              className="rounded-sm border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-[4px_4px_0_#22d3ee] transition hover:-translate-y-0.5"
              onClick={onLogin}
              type="button"
            >
              Entrar con Google
            </button>
          )}
        </nav>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-[#8f3d2b]">
              Task OS
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] sm:text-7xl">
              Organiza tareas, estados y prioridades.
            </h1>
            <div className="mt-5 max-w-md">
              <DailyStreakCard streak={dailyStreak} />
            </div>
          </div>
          <div className="space-y-4">
            <WeeklyActivityChart
              days={weeklyActivity}
              range={activityRange}
              onRangeChange={onActivityRangeChange}
            />
            <div className="grid grid-cols-3 border border-slate-950 bg-white shadow-[8px_8px_0_#0f172a]">
              <Metric label="Activas" value={String(totals.active)} />
              <Metric label="Hechas" value={String(totals.done)} />
              <Metric label="Alta" value={String(totals.high)} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
