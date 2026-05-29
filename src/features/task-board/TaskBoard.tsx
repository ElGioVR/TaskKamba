"use client";

import { TaskBoardHeader } from "./components/TaskBoardHeader";
import { TaskBoardSidebar } from "./components/TaskBoardSidebar";
import {
  FirebaseSetup,
  LoadingBoard,
  SignedOutPanel,
} from "./components/TaskBoardStates";
import { TaskKanban } from "./components/TaskKanban";
import { ToastViewport } from "./components/ToastViewport";
import { useTaskBoard } from "./hooks/useTaskBoard";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function TaskBoard() {
  const board = useTaskBoard();

  if (!isFirebaseConfigured) {
    return <FirebaseSetup />;
  }

  if (board.loading) {
    return <LoadingBoard />;
  }

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-slate-950">
      <TaskBoardHeader
        activityRange={board.activityRange}
        dailyStreak={board.dailyStreak}
        totals={board.totals}
        user={board.user}
        weeklyActivity={board.weeklyActivity}
        onActivityRangeChange={board.setActivityRange}
        onLogin={board.handleLogin}
        onLogout={board.handleLogout}
      />

      {!board.user ? (
        <SignedOutPanel />
      ) : (
        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:px-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-10">
          <TaskBoardSidebar
            activityRange={board.activityRange}
            dateSort={board.dateSort}
            filteredCount={board.filteredTasks.length}
            firestoreError={board.firestoreError}
            historyError={board.historyError}
            isAccountCardVisible={board.isAccountCardVisible}
            isCreateOpen={board.isCreateOpen}
            isFiltersOpen={board.isFiltersOpen}
            isHistoryOpen={board.isHistoryOpen}
            priorityFilter={board.priorityFilter}
            statusFilter={board.statusFilter}
            taskCount={board.tasks.length}
            taskHistory={board.taskHistory}
            user={board.user}
            onCreateTask={board.createTask}
            onResetFilters={board.resetFilters}
            onSetActivityRange={board.setActivityRange}
            onSetDateSort={board.setDateSort}
            onSetPriorityFilter={board.setPriorityFilter}
            onSetStatusFilter={board.setStatusFilter}
            onToggleCreate={() =>
              board.setIsCreateOpen((current) => !current)
            }
            onToggleFilters={() =>
              board.setIsFiltersOpen((current) => !current)
            }
            onToggleHistory={() =>
              board.setIsHistoryOpen((current) => !current)
            }
          />

          <TaskKanban
            activeTask={board.activeTask}
            board={board.board}
            visibleColumns={board.visibleColumns}
            onDelete={board.removeTask}
            onDragCancel={board.handleDragCancel}
            onDragEnd={board.handleDragEnd}
            onDragStart={board.handleDragStart}
            onUpdate={board.updateTask}
          />

          {board.syncing && (
            <div className="fixed bottom-4 left-4 border border-slate-950 bg-white px-4 py-3 text-sm font-black shadow-[5px_5px_0_#22d3ee]">
              Guardando...
            </div>
          )}
          <ToastViewport toasts={board.toasts} />
        </section>
      )}
    </main>
  );
}
