"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import type { Status, Task } from "../model";

type TaskColumnProps = {
  accent: string;
  status: Status;
  tasks: Task[];
  title: string;
  onDelete: (taskId: string) => Promise<void>;
  onUpdate: (taskId: string, update: Partial<Task>) => Promise<void>;
};

export function TaskColumn({
  accent,
  status,
  tasks,
  title,
  onDelete,
  onUpdate,
}: TaskColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <section
      className={`min-h-[560px] min-w-0 border border-slate-950 bg-white p-3 transition ${
        isOver ? "shadow-[8px_8px_0_#22d3ee]" : "shadow-[5px_5px_0_#0f172a]"
      }`}
      ref={setNodeRef}
    >
      <div className="mb-3 flex items-center justify-between border-b border-slate-950/15 pb-3">
        <div className="flex items-center gap-2">
          <span className={`size-3 rounded-full ${accent}`} />
          <h2 className="font-black">{title}</h2>
        </div>
        <span className="grid size-7 place-items-center rounded-sm bg-slate-950 text-xs font-black text-white">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        id={status}
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-[490px] flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
          {!tasks.length && (
            <div className="grid min-h-28 place-items-center border border-dashed border-slate-950/30 bg-slate-50 px-4 text-center text-sm font-semibold text-slate-500">
              Sin tareas
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
