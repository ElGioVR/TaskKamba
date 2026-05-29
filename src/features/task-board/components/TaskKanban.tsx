"use client";

import {
  CollisionDetection,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { TaskColumn } from "./TaskColumn";
import { TaskDragPreview } from "./TaskDragPreview";
import type { Board, Status, Task } from "../model";

type TaskKanbanProps = {
  activeTask: Task | null;
  board: Board;
  visibleColumns: Array<{ id: Status; title: string; accent: string }>;
  onDelete: (taskId: string) => Promise<void>;
  onDragCancel: () => void;
  onDragEnd: (event: DragEndEvent) => Promise<void>;
  onDragStart: (event: DragStartEvent) => void;
  onUpdate: (taskId: string, update: Partial<Task>) => Promise<void>;
};

const columnAwareCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);

  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  return rectIntersection(args);
};

export function TaskKanban({
  activeTask,
  board,
  visibleColumns,
  onDelete,
  onDragCancel,
  onDragEnd,
  onDragStart,
  onUpdate,
}: TaskKanbanProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <DndContext
      collisionDetection={columnAwareCollisionDetection}
      onDragCancel={onDragCancel}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      sensors={sensors}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleColumns.map((column) => (
          <TaskColumn
            accent={column.accent}
            key={column.id}
            status={column.id}
            tasks={board[column.id]}
            title={column.title}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskDragPreview task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
