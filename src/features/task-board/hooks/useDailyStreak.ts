"use client";

import { useEffect, useState } from "react";
import type { DailyStreak } from "../model";

function getDailyStreak() {
  const fallback: DailyStreak = {
    count: 1,
    lastAccess: new Date().toISOString(),
  };

  if (typeof window === "undefined") return fallback;

  const stored = window.localStorage.getItem("gio-task-daily-streak");
  const now = new Date();

  if (!stored) {
    window.localStorage.setItem("gio-task-daily-streak", JSON.stringify(fallback));
    return fallback;
  }

  try {
    const parsed = JSON.parse(stored) as DailyStreak;
    const lastAccess = new Date(parsed.lastAccess);
    const hoursSinceAccess =
      (now.getTime() - lastAccess.getTime()) / (1000 * 60 * 60);
    const sameDay = now.toDateString() === lastAccess.toDateString();
    const nextStreak: DailyStreak = {
      count: hoursSinceAccess > 24 ? 1 : sameDay ? parsed.count : parsed.count + 1,
      lastAccess: now.toISOString(),
    };

    window.localStorage.setItem("gio-task-daily-streak", JSON.stringify(nextStreak));
    return nextStreak;
  } catch {
    window.localStorage.setItem("gio-task-daily-streak", JSON.stringify(fallback));
    return fallback;
  }
}

export function useDailyStreak() {
  const [dailyStreak, setDailyStreak] = useState<DailyStreak>({
    count: 1,
    lastAccess: new Date().toISOString(),
  });

  useEffect(() => {
    window.setTimeout(() => {
      setDailyStreak(getDailyStreak());
    }, 0);
  }, []);

  return dailyStreak;
}
