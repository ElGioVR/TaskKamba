import { describe, expect, test } from "vitest";
import { createTaskCode, filterTasks, getTaskCode } from "../model";
import { tasks } from "./factories/taskFactory";

describe("taskBoardSelectors", () => {
  test("creates readable task codes", () => {
    expect(getTaskCode({ id: "abcdef123456" })).toBe("TASK-ABCDEF");
    expect(createTaskCode(tasks)).toBe("TASK-011");
  });

  test("filters and sorts tasks", () => {
    expect(filterTasks(tasks, "all", "todo", "all", "manual").map((task) => task.id))
      .toEqual(["charlie", "alpha"]);

    expect(filterTasks(tasks, "all", "all", "all", "newest").map((task) => task.id))
      .toEqual(["charlie", "alpha", "bravo"]);

    expect(filterTasks(tasks, "high", "all", "all", "manual").map((task) => task.id))
      .toEqual(["alpha"]);
  });
});
