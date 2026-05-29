"use client";

import { useMemo, useState } from "react";
import {
  filterTasks,
  getActivityDays,
  getVisibleColumns,
  groupTasksByStatus,
  type ActivityRange,
  type DateSort,
  type PriorityFilter,
  type StatusFilter,
  type Task,
} from "../model";

export function useTaskBoardFilters(tasks: Task[]) {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateSort, setDateSort] = useState<DateSort>("manual");
  const [activityRange, setActivityRange] = useState<ActivityRange>("7");

  const filteredTasks = useMemo(() => {
    return filterTasks(
      tasks,
      priorityFilter,
      statusFilter,
      activityRange,
      dateSort,
    );
  }, [activityRange, dateSort, priorityFilter, statusFilter, tasks]);

  const board = useMemo(() => groupTasksByStatus(filteredTasks), [filteredTasks]);
  const visibleColumns = useMemo(
    () => getVisibleColumns(statusFilter),
    [statusFilter],
  );
  const weeklyActivity = useMemo(
    () => getActivityDays(tasks, activityRange),
    [activityRange, tasks],
  );
  const totals = useMemo(
    () => ({
      active: filteredTasks.filter((task) => task.status !== "done").length,
      done: board.done.length,
      high: filteredTasks.filter((task) => task.priority === "high").length,
    }),
    [board.done.length, filteredTasks],
  );

  function resetFilters() {
    setPriorityFilter("all");
    setStatusFilter("all");
    setDateSort("manual");
    setActivityRange("7");
  }

  return {
    activityRange,
    board,
    dateSort,
    filteredTasks,
    priorityFilter,
    statusFilter,
    totals,
    visibleColumns,
    weeklyActivity,
    resetFilters,
    setActivityRange,
    setDateSort,
    setPriorityFilter,
    setStatusFilter,
  };
}
