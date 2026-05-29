import { columns } from "./taskBoardConfig";
import type {
  ActivityRange,
  Board,
  DateSort,
  PriorityFilter,
  Status,
  StatusFilter,
  Task,
  TaskHistorySnapshot,
  TaskTimestamp,
} from "./taskBoardTypes";

export function getEmptyBoard(): Board {
  return { todo: [], doing: [], review: [], done: [] };
}

export function getTaskCode(task: Pick<Task, "id" | "code">) {
  return task.code || `TASK-${task.id.slice(0, 6).toUpperCase()}`;
}

export function timestampToMillis(timestamp?: TaskTimestamp) {
  return timestamp?.toMillis?.() || 0;
}

export function getHistoryChanges(
  before?: TaskHistorySnapshot | null,
  after?: TaskHistorySnapshot | null,
) {
  if (!before || !after) return [];

  const changes: string[] = [];
  if (before.title !== after.title) changes.push("titulo");
  if (before.notes !== after.notes) changes.push("notas");
  if (before.priority !== after.priority) changes.push("prioridad");
  if (before.status !== after.status) changes.push("estatus");
  if (before.position !== after.position) changes.push("orden");

  return changes;
}

export function getTaskHistorySnapshot(task: Partial<Task>) {
  return {
    code: task.code || "",
    title: task.title || "",
    notes: task.notes || "",
    priority: task.priority || "medium",
    status: task.status || "todo",
    position: task.position || 0,
    createdAt: task.createdAt || null,
    updatedAt: task.updatedAt || null,
  };
}

export function isWithinActivityRange(
  task: Task,
  range: ActivityRange,
  now = new Date(),
) {
  if (range === "all") return true;

  const createdAt = task.createdAt?.toDate?.();
  if (!createdAt) return false;

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (Number(range) - 1));

  return createdAt >= start;
}

export function getActivityDays(
  tasks: Task[],
  range: ActivityRange,
  today = new Date(),
) {
  const formatter = new Intl.DateTimeFormat("es", { weekday: "short" });
  const length = range === "all" ? 7 : Number(range);
  const days = Array.from({ length }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (length - 1 - index));

    return {
      key: date.toISOString().slice(0, 10),
      label: formatter.format(date).replace(".", ""),
      count: 0,
    };
  });

  tasks.forEach((task) => {
    const createdAt = task.createdAt?.toDate?.();
    if (!createdAt) return;

    const key = createdAt.toISOString().slice(0, 10);
    const day = days.find((item) => item.key === key);
    if (day) day.count += 1;
  });

  return days;
}

export function filterTasks(
  tasks: Task[],
  priorityFilter: PriorityFilter,
  statusFilter: StatusFilter,
  activityRange: ActivityRange,
  dateSort: DateSort,
) {
  const filtered = tasks.filter((task) => {
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesActivity = isWithinActivityRange(task, activityRange);

    return matchesPriority && matchesStatus && matchesActivity;
  });

  if (dateSort === "newest") {
    return [...filtered].sort(
      (a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt),
    );
  }

  if (dateSort === "oldest") {
    return [...filtered].sort(
      (a, b) => timestampToMillis(a.createdAt) - timestampToMillis(b.createdAt),
    );
  }

  return [...filtered].sort((a, b) => (a.position || 0) - (b.position || 0));
}

export function groupTasksByStatus(tasks: Task[]) {
  return tasks.reduce<Board>((current, task) => {
    current[task.status].push(task);
    return current;
  }, getEmptyBoard());
}

export function getVisibleColumns(statusFilter: StatusFilter) {
  if (statusFilter === "all") return columns;
  return columns.filter((column) => column.id === statusFilter);
}

export function findStatus(id: string, board: Board): Status | undefined {
  if (columns.some((column) => column.id === id)) return id as Status;
  return columns.find((column) => board[column.id].some((task) => task.id === id))
    ?.id;
}

export function createTaskCode(tasks: Array<Pick<Task, "code">>) {
  const nextNumber =
    Math.max(
      0,
      ...tasks.map((task) => {
        const match = task.code?.match(/^TASK-(\d+)$/);
        return match ? Number(match[1]) : 0;
      }),
    ) + 1;

  return `TASK-${String(nextNumber).padStart(3, "0")}`;
}

export function reorderBoard(
  board: Board,
  activeId: string,
  overId: string,
): { board: Board; from: Status; to: Status; task: Task } | null {
  const from = findStatus(activeId, board);
  const to = findStatus(overId, board);
  if (!from || !to) return null;

  const movingTask = board[from].find((task) => task.id === activeId);
  if (!movingTask) return null;

  const nextBoard: Board = {
    todo: [...board.todo],
    doing: [...board.doing],
    review: [...board.review],
    done: [...board.done],
  };

  if (from === to) {
    const oldIndex = board[from].findIndex((task) => task.id === activeId);
    const isOverColumn = columns.some((column) => column.id === overId);
    const newIndex = isOverColumn
      ? board[to].length - 1
      : board[to].findIndex((task) => task.id === overId);

    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return null;

    const reordered = [...board[to]];
    const [task] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, task);
    nextBoard[to] = reordered;
  } else {
    nextBoard[from] = nextBoard[from].filter((task) => task.id !== activeId);

    const overIndex = nextBoard[to].findIndex((task) => task.id === overId);
    const insertAt = overIndex >= 0 ? overIndex : nextBoard[to].length;
    const movedTask = { ...movingTask, status: to };
    nextBoard[to] = [
      ...nextBoard[to].slice(0, insertAt),
      movedTask,
      ...nextBoard[to].slice(insertAt),
    ];
  }

  return { board: nextBoard, from, to, task: movingTask };
}

export function flattenBoard(board: Board) {
  return columns.flatMap((column) =>
    board[column.id].map((task, index) => ({
      ...task,
      status: column.id,
      position: (index + 1) * 1000,
    })),
  );
}
