"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, type FormEvent } from "react";
import {
  columns,
  getTaskCode,
  priorityStyles,
  type Priority,
  type Status,
  type Task,
} from "../model";

type TaskCardProps = {
  task: Task;
  onDelete: (taskId: string) => Promise<void>;
  onUpdate: (taskId: string, update: Partial<Task>) => Promise<void>;
};

export function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    const priority = String(form.get("priority") || "medium") as Priority;
    if (!title) return;

    await onUpdate(task.id, { title, notes, priority });
    formElement.reset();
    setIsEditing(false);
  }

  async function changeStatus(nextStatus: Status) {
    if (nextStatus === task.status) return;
    await onUpdate(task.id, { status: nextStatus });
  }

  return (
    <article
      className={`min-w-0 touch-none border border-slate-950 bg-[#fbf8f1] p-3 shadow-[4px_4px_0_#0f172a] transition-all duration-200 ease-out ${
        isDragging
          ? "scale-[0.98] opacity-25 shadow-none"
          : "hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0f172a]"
      }`}
      ref={setNodeRef}
      style={style}
    >
      {isEditing ? (
        <form onSubmit={saveEdit}>
          <div className="mb-3 inline-flex rounded-sm border border-slate-950 bg-white px-2 py-1 font-mono text-xs font-black text-slate-600">
            {getTaskCode(task)}
          </div>
          <input
            className="w-full rounded-none border border-slate-950 bg-white px-2 py-2 text-sm font-black outline-none"
            defaultValue={task.title}
            name="title"
            required
          />
          <textarea
            className="mt-2 min-h-20 w-full resize-none rounded-none border border-slate-950 bg-white px-2 py-2 text-sm outline-none"
            defaultValue={task.notes}
            name="notes"
          />
          <select
            className="mt-2 w-full rounded-none border border-slate-950 bg-white px-2 py-2 text-sm outline-none"
            defaultValue={task.priority}
            name="priority"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          <select
            className="mt-2 w-full rounded-none border border-slate-950 bg-white px-2 py-2 text-sm outline-none"
            defaultValue={task.status}
            name="status"
            onChange={(event) => changeStatus(event.target.value as Status)}
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className="rounded-sm border border-slate-950 bg-slate-950 px-2 py-2 text-xs font-black text-white"
              type="submit"
            >
              Guardar
            </button>
            <button
              className="rounded-sm border border-slate-950 px-2 py-2 text-xs font-black"
              onClick={() => setIsEditing(false)}
              type="button"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <button
            className="mb-3 w-full cursor-grab border border-slate-950/20 bg-white px-2 py-1 text-left text-xs font-black uppercase tracking-[0.16em] text-slate-500 transition hover:border-slate-950 hover:text-slate-950 active:cursor-grabbing active:bg-[#d6f36b]"
            type="button"
            {...attributes}
            {...listeners}
          >
            Arrastrar
          </button>
          <div className="mb-3 grid gap-2 min-[1500px]:grid-cols-[auto_minmax(0,1fr)] min-[1500px]:items-center">
            <span className="min-w-0 rounded-sm border border-slate-950 bg-white px-2 py-1 text-center font-mono text-xs font-black text-slate-700">
              {getTaskCode(task)}
            </span>
            <select
              aria-label="Cambiar estatus"
              className="w-full min-w-0 rounded-sm border border-slate-950/30 bg-white px-2 py-1 text-xs font-black text-slate-700 outline-none focus:shadow-[0_0_0_3px_#22d3ee]"
              onChange={(event) => changeStatus(event.target.value as Status)}
              value={task.status}
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
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
            <p className="mt-2 text-sm leading-6 text-slate-700">{task.notes}</p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              className="rounded-sm border border-slate-950 px-2 py-2 text-xs font-black transition hover:bg-slate-950 hover:text-white"
              onClick={() => setIsEditing(true)}
              type="button"
            >
              Editar
            </button>
            <button
              className="rounded-sm border border-slate-950 px-2 py-2 text-xs font-black text-[#8f3d2b] transition hover:bg-[#8f3d2b] hover:text-white"
              onClick={() => onDelete(task.id)}
              type="button"
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </article>
  );
}
