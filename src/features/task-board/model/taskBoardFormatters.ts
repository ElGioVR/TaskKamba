import type { TaskTimestamp } from "./taskBoardTypes";

export function formatHistoryDate(timestamp?: TaskTimestamp) {
  const date = timestamp?.toDate?.();
  if (!date) return "Ahora";

  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(date);
}
