import {
  formatHistoryDate,
  historyActionLabels,
  statusLabels,
  type TaskHistoryEntry,
} from "../model";

type TaskHistoryProps = {
  entries: TaskHistoryEntry[];
};

export function TaskHistory({ entries }: TaskHistoryProps) {
  if (!entries.length) {
    return (
      <div className="border border-dashed border-slate-950/30 bg-[#fbf8f1] p-3 text-sm font-bold text-slate-600">
        Aun no hay movimientos registrados.
      </div>
    );
  }

  return (
    <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
      {entries.map((entry) => {
        const beforeStatus = entry.before?.status;
        const afterStatus = entry.after?.status;
        const movedStatus =
          beforeStatus && afterStatus && beforeStatus !== afterStatus;

        return (
          <article
            className="border border-slate-950/15 bg-[#fbf8f1] p-3"
            key={entry.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8f3d2b]">
                  {historyActionLabels[entry.action]}
                </p>
                <h3 className="mt-1 break-words text-sm font-black leading-snug">
                  {entry.taskCode} - {entry.taskTitle}
                </h3>
              </div>
              <time className="shrink-0 text-right text-[11px] font-black text-slate-500">
                {formatHistoryDate(entry.createdAt)}
              </time>
            </div>

            {movedStatus && (
              <p className="mt-2 text-xs font-bold text-slate-700">
                {statusLabels[beforeStatus]} a {statusLabels[afterStatus]}
              </p>
            )}

            {!!entry.changes?.length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.changes.map((change) => (
                  <span
                    className="rounded-sm border border-slate-950/20 bg-white px-2 py-1 text-[11px] font-black uppercase text-slate-600"
                    key={change}
                  >
                    {change}
                  </span>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
