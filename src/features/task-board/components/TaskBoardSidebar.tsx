import type { User } from "firebase/auth";
import { TaskHistory } from "./TaskHistory";
import {
  activityRangeLabels,
  columns,
  priorityLabels,
  type ActivityRange,
  type DateSort,
  type PriorityFilter,
  type StatusFilter,
  type TaskHistoryEntry,
} from "../model";

type TaskBoardSidebarProps = {
  activityRange: ActivityRange;
  dateSort: DateSort;
  filteredCount: number;
  firestoreError: string;
  historyError: string;
  isAccountCardVisible: boolean;
  isCreateOpen: boolean;
  isFiltersOpen: boolean;
  isHistoryOpen: boolean;
  priorityFilter: PriorityFilter;
  statusFilter: StatusFilter;
  taskHistory: TaskHistoryEntry[];
  taskCount: number;
  user: User;
  onCreateTask: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onResetFilters: () => void;
  onSetActivityRange: (range: ActivityRange) => void;
  onSetDateSort: (sort: DateSort) => void;
  onSetPriorityFilter: (filter: PriorityFilter) => void;
  onSetStatusFilter: (filter: StatusFilter) => void;
  onToggleCreate: () => void;
  onToggleFilters: () => void;
  onToggleHistory: () => void;
};

function getUserInitials(user: User) {
  const source = user.displayName || user.email || "Usuario";
  const parts = source
    .replace(/@.*/, "")
    .split(/[\s._-]+/)
    .filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function TaskBoardSidebar({
  activityRange,
  dateSort,
  filteredCount,
  firestoreError,
  historyError,
  isAccountCardVisible,
  isCreateOpen,
  isFiltersOpen,
  isHistoryOpen,
  priorityFilter,
  statusFilter,
  taskHistory,
  taskCount,
  user,
  onCreateTask,
  onResetFilters,
  onSetActivityRange,
  onSetDateSort,
  onSetPriorityFilter,
  onSetStatusFilter,
  onToggleCreate,
  onToggleFilters,
  onToggleHistory,
}: TaskBoardSidebarProps) {
  return (
    <aside className="space-y-4">
      {firestoreError && (
        <section className="border border-sky-900 bg-sky-50 p-4 text-sky-950 shadow-[6px_6px_0_#0f172a]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
            Configuracion pendiente
          </p>
          <h2 className="mt-2 text-lg font-black">
            Firestore necesita permisos para tus tareas
          </h2>
          <p className="mt-2 text-sm leading-6 text-sky-900/80">
            Tu sesion de Google funciona, pero la base de datos todavia no
            permite leer o guardar tareas para este usuario. Publica las reglas
            de Firestore del archivo FIREBASE_SETUP.md y recarga la pagina.
          </p>
          <p className="mt-3 rounded-sm border border-sky-900/20 bg-white px-3 py-2 font-mono text-xs text-sky-900/70">
            {firestoreError}
          </p>
        </section>
      )}

      <section className="border border-slate-950 bg-white p-4 shadow-[6px_6px_0_#0f172a]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black">Nueva tarea</h2>
            <p className="mt-1 text-sm text-slate-600">
              Agrega una tarjeta cuando la necesites.
            </p>
          </div>
          <button
            aria-expanded={isCreateOpen}
            className="rounded-sm border border-slate-950 bg-slate-950 px-3 py-2 text-sm font-black text-white transition hover:bg-[#8f3d2b]"
            onClick={onToggleCreate}
            type="button"
          >
            {isCreateOpen ? "Cerrar" : "Agregar"}
          </button>
        </div>

        {isCreateOpen && (
          <form className="mt-4 border-t border-slate-950/15 pt-4" onSubmit={onCreateTask}>
            <label className="block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Titulo
            </label>
            <input
              className="mt-2 w-full rounded-none border border-slate-950 bg-[#fbf8f1] px-3 py-2 outline-none focus:shadow-[0_0_0_3px_#22d3ee]"
              name="title"
              placeholder="Preparar caso de estudio"
              required
            />
            <label className="mt-4 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Notas
            </label>
            <textarea
              className="mt-2 min-h-24 w-full resize-none rounded-none border border-slate-950 bg-[#fbf8f1] px-3 py-2 outline-none focus:shadow-[0_0_0_3px_#22d3ee]"
              name="notes"
              placeholder="Contexto, bloqueos o siguiente accion"
            />
            <label className="mt-4 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Prioridad
            </label>
            <select
              className="mt-2 w-full rounded-none border border-slate-950 bg-[#fbf8f1] px-3 py-2 outline-none focus:shadow-[0_0_0_3px_#22d3ee]"
              defaultValue="medium"
              name="priority"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
            <button
              className="mt-4 w-full rounded-sm border border-slate-950 bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-[#8f3d2b]"
              type="submit"
            >
              Crear tarea
            </button>
          </form>
        )}
      </section>

      <section className="border border-slate-950 bg-white p-4 shadow-[6px_6px_0_#0f172a]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black">Filtros</h2>
            <p className="mt-1 text-sm text-slate-600">
              Mostrando {filteredCount} de {taskCount}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-sm border border-slate-950/30 px-3 py-2 text-xs font-black transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
              onClick={onResetFilters}
              type="button"
            >
              Limpiar
            </button>
            <button
              aria-expanded={isFiltersOpen}
              className="rounded-sm border border-slate-950 bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:bg-[#8f3d2b]"
              onClick={onToggleFilters}
              type="button"
            >
              {isFiltersOpen ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <div className={`${isFiltersOpen ? "block" : "hidden"}`}>
          <label className="mt-4 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Prioridad
          </label>
          <select
            className="mt-2 w-full rounded-none border border-slate-950 bg-[#fbf8f1] px-3 py-2 outline-none focus:shadow-[0_0_0_3px_#22d3ee]"
            onChange={(event) =>
              onSetPriorityFilter(event.target.value as PriorityFilter)
            }
            value={priorityFilter}
          >
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Estatus
          </label>
          <select
            className="mt-2 w-full rounded-none border border-slate-950 bg-[#fbf8f1] px-3 py-2 outline-none focus:shadow-[0_0_0_3px_#22d3ee]"
            onChange={(event) => onSetStatusFilter(event.target.value as StatusFilter)}
            value={statusFilter}
          >
            <option value="all">Todos</option>
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Rango
          </label>
          <select
            className="mt-2 w-full rounded-none border border-slate-950 bg-[#fbf8f1] px-3 py-2 outline-none focus:shadow-[0_0_0_3px_#22d3ee]"
            onChange={(event) => onSetActivityRange(event.target.value as ActivityRange)}
            value={activityRange}
          >
            {Object.entries(activityRangeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Fecha
          </label>
          <select
            className="mt-2 w-full rounded-none border border-slate-950 bg-[#fbf8f1] px-3 py-2 outline-none focus:shadow-[0_0_0_3px_#22d3ee]"
            onChange={(event) => onSetDateSort(event.target.value as DateSort)}
            value={dateSort}
          >
            <option value="manual">Orden del tablero</option>
            <option value="newest">Mas recientes primero</option>
            <option value="oldest">Mas antiguas primero</option>
          </select>
        </div>
      </section>

      <section className="border border-slate-950 bg-white p-4 shadow-[6px_6px_0_#0f172a]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black">Historial</h2>
            <p className="mt-1 text-sm text-slate-600">
              {taskHistory.length} actualizaciones recientes
            </p>
          </div>
          <button
            aria-expanded={isHistoryOpen}
            className="rounded-sm border border-slate-950 bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:bg-[#8f3d2b]"
            onClick={onToggleHistory}
            type="button"
          >
            {isHistoryOpen ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <div className={`${isHistoryOpen ? "block" : "hidden"} mt-4`}>
          {historyError && (
            <div className="mb-3 border border-amber-900 bg-amber-50 p-3 text-sm text-amber-950">
              <p className="font-black">Historial sin permisos</p>
              <p className="mt-1 leading-5">
                Publica las reglas de Firestore actualizadas para
                <code className="mx-1 font-mono">users/{"{userId}"}/history</code>.
              </p>
              <p className="mt-2 break-all font-mono text-xs text-amber-900/75">
                {historyError}
              </p>
            </div>
          )}
          <TaskHistory entries={taskHistory} />
        </div>
      </section>

      <section
        className={`border border-emerald-900 bg-emerald-50 p-4 text-emerald-950 shadow-[6px_6px_0_#0f172a] ${
          isAccountCardVisible ? "block" : "hidden lg:block"
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-sm font-black text-white">
            {getUserInitials(user)}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              Cuenta conectada
            </p>
            <h2 className="mt-1 text-lg font-black">
              Tus tareas se guardan automaticamente
            </h2>
            <p className="mt-2 break-words text-sm font-bold text-emerald-900">
              {user.email}
            </p>
            <p className="mt-3 text-sm leading-6 text-emerald-900/75">
              Todo lo que crees, edites o muevas queda sincronizado en tu tablero
              privado.
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
}
