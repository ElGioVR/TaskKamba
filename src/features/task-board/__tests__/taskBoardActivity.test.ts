import { describe, expect, test } from "vitest";
import { getActivityDays } from "../model";
import { tasks } from "./factories/taskFactory";

describe("taskBoardActivity", () => {
  test("counts activity days", () => {
    const days = getActivityDays(tasks, "7", new Date("2026-05-28T18:00:00.000Z"));

    expect(days).toHaveLength(7);
    expect(days.at(-1)).toMatchObject({ key: "2026-05-28", count: 1 });
    expect(days.find((day) => day.key === "2026-05-27")?.count).toBe(1);
  });
});
