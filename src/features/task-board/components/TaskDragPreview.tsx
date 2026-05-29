import { getTaskCode, priorityStyles, type Task } from "../model";

type TaskDragPreviewProps = {
  task: Task;
};

export function TaskDragPreview({ task }: TaskDragPreviewProps) {
  return (
    <article className="w-[280px] rotate-2 border-2 border-slate-950 bg-white p-3 shadow-[12px_12px_0_#22d3ee]">
      <div className="mb-3 inline-flex rounded-sm border border-slate-950 bg-[#d6f36b] px-2 py-1 font-mono text-xs font-black text-slate-800">
        {getTaskCode(task)}
      </div>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="min-w-0 break-words font-black leading-tight">
          {task.title}
        </h3>
        <span
          className={`shrink-0 rounded-sm px-2 py-1 text-[11px] font-black uppercase ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>
      {task.notes && (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
          {task.notes}
        </p>
      )}
      <div className="mt-4 rounded-sm border border-slate-950 bg-[#fbf8f1] px-2 py-1 text-xs font-black text-slate-700">
        Moviendo a otro estado
      </div>
    </article>
  );
}
