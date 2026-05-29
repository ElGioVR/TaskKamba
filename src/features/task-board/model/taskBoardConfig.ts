import type {
  ActivityRange,
  Priority,
  PriorityFilter,
  Status,
  TaskHistoryAction,
} from "./taskBoardTypes";

export const columns: Array<{ id: Status; title: string; accent: string }> = [
  { id: "todo", title: "Por hacer", accent: "bg-sky-400" },
  { id: "doing", title: "En progreso", accent: "bg-amber-400" },
  { id: "review", title: "Revision", accent: "bg-fuchsia-400" },
  { id: "done", title: "Hecho", accent: "bg-emerald-400" },
];

export const statusLabels: Record<Status, string> = {
  todo: "Por hacer",
  doing: "En progreso",
  review: "Revision",
  done: "Hecho",
};

export const priorityStyles: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
};

export const priorityLabels: Record<PriorityFilter, string> = {
  all: "Todas",
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export const historyActionLabels: Record<TaskHistoryAction, string> = {
  created: "Creada",
  updated: "Editada",
  moved: "Movida",
  deleted: "Eliminada",
};

export const activityRangeLabels: Record<ActivityRange, string> = {
  "7": "7 dias",
  "14": "14 dias",
  "30": "30 dias",
  all: "Todo",
};
