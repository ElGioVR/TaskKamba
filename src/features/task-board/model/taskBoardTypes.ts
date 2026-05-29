export type Status = "todo" | "doing" | "review" | "done";
export type Priority = "low" | "medium" | "high";
export type PriorityFilter = Priority | "all";
export type StatusFilter = Status | "all";
export type DateSort = "manual" | "newest" | "oldest";
export type ActivityRange = "7" | "14" | "30" | "all";
export type TaskHistoryAction = "created" | "updated" | "moved" | "deleted";

export type TaskTimestamp = {
  toDate?: () => Date;
  toMillis?: () => number;
};

export type Task = {
  id: string;
  code?: string;
  title: string;
  notes: string;
  priority: Priority;
  status: Status;
  position: number;
  createdAt?: TaskTimestamp;
  updatedAt?: TaskTimestamp;
};

export type TaskHistorySnapshot = {
  code: string;
  title: string;
  notes: string;
  priority: Priority;
  status: Status;
  position: number;
  createdAt: TaskTimestamp | null;
  updatedAt: TaskTimestamp | null;
};

export type Board = Record<Status, Task[]>;

export type Toast = {
  id: string;
  title: string;
  detail: string;
};

export type DailyStreak = {
  count: number;
  lastAccess: string;
};

export type TaskHistoryEntry = {
  id: string;
  action: TaskHistoryAction;
  taskId: string;
  taskCode: string;
  taskTitle: string;
  createdAt?: TaskTimestamp;
  before?: TaskHistorySnapshot | null;
  after?: TaskHistorySnapshot | null;
  changes?: string[];
};
