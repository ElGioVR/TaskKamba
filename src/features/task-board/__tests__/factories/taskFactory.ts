import type { Task } from "../../model";

export const timestamp = (date: string) => ({
  toDate: () => new Date(date),
  toMillis: () => new Date(date).getTime(),
});

export const tasks: Task[] = [
  {
    id: "alpha",
    code: "TASK-002",
    title: "Alpha",
    notes: "",
    priority: "high",
    status: "todo",
    position: 2000,
    createdAt: timestamp("2026-05-27T12:00:00.000Z"),
  },
  {
    id: "bravo",
    title: "Bravo",
    notes: "",
    priority: "low",
    status: "doing",
    position: 1000,
    createdAt: timestamp("2026-05-25T12:00:00.000Z"),
  },
  {
    id: "charlie",
    code: "TASK-010",
    title: "Charlie",
    notes: "",
    priority: "medium",
    status: "todo",
    position: 1000,
    createdAt: timestamp("2026-05-28T12:00:00.000Z"),
  },
];
