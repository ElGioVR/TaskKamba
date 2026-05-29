import { activityRangeLabels, type ActivityRange } from "../model";

type WeeklyActivityChartProps = {
  days: Array<{ key: string; label: string; count: number }>;
  range: ActivityRange;
  onRangeChange: (range: ActivityRange) => void;
};

export function WeeklyActivityChart({
  days,
  range,
  onRangeChange,
}: WeeklyActivityChartProps) {
  const maxCount = Math.max(1, ...days.map((day) => day.count));
  const total = days.reduce((sum, day) => sum + day.count, 0);

  return (
    <section className="border border-slate-950 bg-white p-4 shadow-[8px_8px_0_#0f172a]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Actividad
          </p>
          <h2 className="mt-1 text-xl font-black">{total} tareas creadas</h2>
        </div>
        <select
          aria-label="Filtrar actividad"
          className="rounded-sm border border-slate-950 bg-[#d6f36b] px-2 py-1 text-xs font-black text-slate-950 outline-none"
          onChange={(event) => onRangeChange(event.target.value as ActivityRange)}
          value={range}
        >
          {Object.entries(activityRangeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid h-28 grid-cols-7 items-end gap-2">
        {days.map((day) => (
          <div className="flex h-full min-w-0 flex-col justify-end gap-2" key={day.key}>
            <div className="flex flex-1 items-end">
              <div
                aria-label={`${day.label}: ${day.count} tareas`}
                className="w-full border border-slate-950 bg-[#22d3ee] transition-all"
                style={{
                  height: `${Math.max(10, (day.count / maxCount) * 100)}%`,
                  opacity: day.count ? 1 : 0.28,
                }}
                title={`${day.count} tareas`}
              />
            </div>
            <div className="text-center text-[10px] font-black uppercase text-slate-500">
              {day.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
