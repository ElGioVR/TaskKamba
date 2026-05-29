"use client";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { signInWithPopup, signOut, type User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import type { FormEvent } from "react";
import { useState } from "react";
import { firebaseAuth, firestore, googleProvider } from "@/lib/firebase";
import {
  createTaskCode,
  flattenBoard,
  getHistoryChanges,
  getTaskCode,
  getTaskHistorySnapshot,
  reorderBoard,
  statusLabels,
  type Board,
  type Priority,
  type Status,
  type Task,
  type TaskHistoryAction,
} from "../model";
import { playDragSound } from "./useDragAudio";

type UseTaskActionsProps = {
  board: Board;
  setHistoryError: (error: string) => void;
  setTasks: (tasks: Task[]) => void;
  showToast: (title: string, detail: string) => void;
  tasks: Task[];
  user: User | null;
};

export function useTaskActions({
  board,
  setHistoryError,
  setTasks,
  showToast,
  tasks,
  user,
}: UseTaskActionsProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function handleLogin() {
    if (!firebaseAuth) return;
    await signInWithPopup(firebaseAuth, googleProvider);
  }

  async function handleLogout() {
    if (!firebaseAuth) return;
    await signOut(firebaseAuth);
  }

  async function trackTaskHistory(
    action: TaskHistoryAction,
    taskId: string,
    before?: Partial<Task>,
    after?: Partial<Task>,
    customChanges?: string[],
  ) {
    if (!user || !firestore) return;

    const taskSnapshot = after || before || {};
    const beforeSnapshot = before ? getTaskHistorySnapshot(before) : null;
    const afterSnapshot = after ? getTaskHistorySnapshot(after) : null;

    try {
      await addDoc(collection(firestore, "users", user.uid, "history"), {
        action,
        taskId,
        taskCode: getTaskCode({
          id: taskId,
          code: taskSnapshot.code,
        }),
        taskTitle: taskSnapshot.title || taskId,
        before: beforeSnapshot,
        after: afterSnapshot,
        changes: customChanges || getHistoryChanges(beforeSnapshot, afterSnapshot),
        createdAt: Timestamp.now(),
      });
      setHistoryError("");
    } catch (error) {
      setHistoryError(error instanceof Error ? error.message : "Historial bloqueado");
    }
  }

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !firestore) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const title = String(form.get("title") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    const priority = String(form.get("priority") || "medium") as Priority;

    if (!title) return;

    const nextPosition =
      Math.max(0, ...tasks.map((task) => task.position || 0)) + 1000;
    const code = createTaskCode(tasks);
    const now = Timestamp.now();
    const nextTask = {
      code,
      title,
      notes,
      priority,
      status: "todo" as Status,
      position: nextPosition,
      createdAt: now,
      updatedAt: now,
    };

    const taskRef = await addDoc(
      collection(firestore, "users", user.uid, "tasks"),
      nextTask,
    );
    await trackTaskHistory("created", taskRef.id, undefined, nextTask, [
      "tarea creada",
    ]);

    formElement.reset();
    showToast("Tarea agregada", `${code} · ${title}`);
  }

  async function updateTask(taskId: string, update: Partial<Task>) {
    if (!user || !firestore) return;
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    const taskTitle = update.title || task?.title || taskId;
    const taskCode = task ? getTaskCode(task) : taskId;
    const nextUpdate = { ...update };

    if (update.status && update.status !== task?.status && !update.position) {
      nextUpdate.position =
        Math.max(
          0,
          ...tasks
            .filter((item) => item.status === update.status && item.id !== taskId)
            .map((item) => item.position || 0),
        ) + 1000;
    }

    const now = Timestamp.now();
    await updateDoc(doc(firestore, "users", user.uid, "tasks", taskId), {
      ...nextUpdate,
      updatedAt: now,
    });
    await trackTaskHistory("updated", taskId, task, {
      ...task,
      ...nextUpdate,
      updatedAt: now,
    });

    if (update.status && update.status !== task?.status) {
      showToast("Estatus actualizado", `${taskCode} · ${statusLabels[update.status]}`);
      return;
    }

    showToast("Tarea editada", `${taskCode} · ${taskTitle}`);
  }

  async function removeTask(taskId: string) {
    if (!user || !firestore) return;
    const task = tasks.find((item) => item.id === taskId);
    const taskTitle = task?.title || taskId;
    const taskCode = task ? getTaskCode(task) : taskId;

    await trackTaskHistory("deleted", taskId, task, undefined, ["tarea eliminada"]);
    await deleteDoc(doc(firestore, "users", user.uid, "tasks", taskId));
    showToast("Tarea eliminada", `${taskCode} · ${taskTitle}`);
  }

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((item) => item.id === String(event.active.id));
    setActiveTask(task || null);
    playDragSound("lift");
  }

  function handleDragCancel() {
    setActiveTask(null);
    playDragSound("cancel");
  }

  async function handleDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : null;

    setActiveTask(null);

    if (!overId || activeId === overId || !user || !firestore) {
      playDragSound("cancel");
      return;
    }

    const reordered = reorderBoard(board, activeId, overId);
    if (!reordered) {
      playDragSound("cancel");
      return;
    }

    const { from, to, task: movingTask } = reordered;
    const nextTasks = flattenBoard(reordered.board);

    setTasks(nextTasks);
    setSyncing(true);

    const database = firestore;
    const batch = writeBatch(database);
    const now = Timestamp.now();
    nextTasks.forEach((task) => {
      batch.update(doc(database, "users", user.uid, "tasks", task.id), {
        status: task.status,
        position: task.position,
        updatedAt: now,
      });
    });

    await batch.commit();
    await trackTaskHistory(
      "moved",
      activeId,
      movingTask,
      {
        ...movingTask,
        status: to,
        position:
          nextTasks.find((task) => task.id === activeId)?.position ||
          movingTask.position,
        updatedAt: now,
      },
      from === to ? ["orden"] : ["estatus", "orden"],
    );
    setSyncing(false);
    playDragSound("drop");
    showToast(
      "Estatus actualizado",
      `${getTaskCode(movingTask)} · ${statusLabels[to]}`,
    );
  }

  return {
    activeTask,
    syncing,
    createTask,
    handleDragCancel,
    handleDragEnd,
    handleDragStart,
    handleLogin,
    handleLogout,
    removeTask,
    updateTask,
  };
}
