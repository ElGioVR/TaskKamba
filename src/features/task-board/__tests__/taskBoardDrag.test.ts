import { describe, expect, test } from "vitest";
import { flattenBoard, groupTasksByStatus, reorderBoard } from "../model";
import { tasks } from "./factories/taskFactory";

describe("taskBoardDrag", () => {
  test("moves tasks between columns", () => {
    const board = groupTasksByStatus(tasks);
    const reordered = reorderBoard(board, "alpha", "bravo");

    expect(reordered?.from).toBe("todo");
    expect(reordered?.to).toBe("doing");
    expect(flattenBoard(reordered?.board ?? board).map((task) => [
      task.id,
      task.status,
      task.position,
    ])).toEqual([
      ["charlie", "todo", 1000],
      ["alpha", "doing", 1000],
      ["bravo", "doing", 2000],
    ]);
  });
});
