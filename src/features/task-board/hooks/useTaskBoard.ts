"use client";

import { useEffect, useState } from "react";
import { useDailyStreak } from "./useDailyStreak";
import { useTaskActions } from "./useTaskActions";
import { useTaskBoardData } from "./useTaskBoardData";
import { useTaskBoardFilters } from "./useTaskBoardFilters";
import { useToasts } from "./useToasts";

export function useTaskBoard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAccountCardVisible, setIsAccountCardVisible] = useState(true);
  const dailyStreak = useDailyStreak();
  const { toasts, showToast } = useToasts();
  const data = useTaskBoardData();
  const filters = useTaskBoardFilters(data.tasks);
  const actions = useTaskActions({
    board: filters.board,
    setHistoryError: data.setHistoryError,
    setTasks: data.setTasks,
    showToast,
    tasks: data.tasks,
    user: data.user,
  });

  useEffect(() => {
    if (!data.user) return;

    window.setTimeout(() => {
      setIsAccountCardVisible(true);
    }, 0);

    const timeoutId = window.setTimeout(() => {
      setIsAccountCardVisible(false);
    }, 7000);

    return () => window.clearTimeout(timeoutId);
  }, [data.user]);

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    await actions.createTask(event);
    setIsCreateOpen(false);
  }

  return {
    ...data,
    ...filters,
    ...actions,
    createTask,
    dailyStreak,
    isAccountCardVisible,
    isCreateOpen,
    isFiltersOpen,
    isHistoryOpen,
    toasts,
    setIsCreateOpen,
    setIsFiltersOpen,
    setIsHistoryOpen,
  };
}
