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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="h-6 w-6 text-white"
        >
          <path
            d="M12 2.5c.08.02.68.22 1.34.7 1.37.97 2.1 2.8 1.9 4.68-.12 1.03-.53 1.86-1.06 2.5-.54.64-1.18 1.04-1.69 1.4-.57.41-1.01.73-1.01 1.9 0 1.47.75 2.26 1.71 2.96.92.67 2.1 1.5 2.1 3.44 0 1.97-1.6 3.5-3.5 3.5-1.88 0-3.5-1.5-3.5-3.4 0-1.4.6-2.3 1.24-3.08.45-.56.9-1.12 1.24-1.8.3-.6.47-1.2.47-1.92 0-1.18-.38-1.7-1.03-2.24-.7-.58-1.56-.98-2.23-1.72-.46-.51-.72-1.03-.74-1.7-.06-1.84 1.18-3.86 3.22-4.52C10.6 2.3 11.85 2.35 12 2.5Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
