import type { DailyStreak } from "../model";

type DailyStreakCardProps = {
  streak: DailyStreak;
};

export function DailyStreakCard({ streak }: DailyStreakCardProps) {
  return (
    <section className="flex items-center justify-between gap-4 border border-slate-950 bg-[#fff3d6] p-4 shadow-[8px_8px_0_#0f172a]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8f3d2b]">
          Racha diaria
        </p>
        <h2 className="mt-1 text-xl font-black">
          {streak.count} {streak.count === 1 ? "dia activo" : "dias activos"}
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          Se reinicia si pasan mas de 24 horas sin abrir la app.
        </p>
      </div>
      <div className="grid size-14 shrink-0 place-items-center rounded-full bg-[#ff7a1a] text-2xl">
        *
      </div>
    </section>
  );
}
