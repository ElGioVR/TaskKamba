"use client";

import { User, onAuthStateChanged } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseAuth, firestore } from "@/lib/firebase";
import type { Task, TaskHistoryEntry } from "../model";

export function useTaskBoardData() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistoryEntry[]>([]);
  const [loading, setLoading] = useState(Boolean(firebaseAuth && firestore));
  const [firestoreError, setFirestoreError] = useState("");
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    if (!firebaseAuth || !firestore) return;

    return onAuthStateChanged(firebaseAuth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setFirestoreError("");

      if (!currentUser) {
        setTasks([]);
        setTaskHistory([]);
        setHistoryError("");
      }
    });
  }, []);

  useEffect(() => {
    if (!user || !firestore) return;

    const tasksRef = collection(firestore, "users", user.uid, "tasks");
    const tasksQuery = query(tasksRef, orderBy("position", "asc"));

    return onSnapshot(
      tasksQuery,
      (snapshot) => {
        setFirestoreError("");
        const nextTasks = snapshot.docs.map((taskDoc) => ({
          id: taskDoc.id,
          ...taskDoc.data(),
        })) as Task[];

        setTasks(nextTasks);
      },
      (error) => {
        setFirestoreError(error.message);
      },
    );
  }, [user]);

  useEffect(() => {
    if (!user || !firestore) return;

    const historyRef = collection(firestore, "users", user.uid, "history");
    const historyQuery = query(historyRef, orderBy("createdAt", "desc"), limit(80));

    return onSnapshot(
      historyQuery,
      (snapshot) => {
        setHistoryError("");
        const nextHistory = snapshot.docs.map((historyDoc) => ({
          id: historyDoc.id,
          ...historyDoc.data(),
        })) as TaskHistoryEntry[];

        setTaskHistory(nextHistory);
      },
      (error) => {
        setHistoryError(error.message);
      },
    );
  }, [user]);

  return {
    firestoreError,
    historyError,
    loading,
    taskHistory,
    tasks,
    user,
    setHistoryError,
    setTasks,
  };
}
