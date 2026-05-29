import type { Toast } from "../model";

type ToastViewportProps = {
  toasts: Toast[];
};

export function ToastViewport({ toasts }: ToastViewportProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[min(360px,calc(100vw-32px))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          className="border border-slate-950 bg-white p-4 shadow-[5px_5px_0_#22d3ee]"
          key={toast.id}
        >
          <p className="text-sm font-black text-slate-950">{toast.title}</p>
          <p className="mt-1 break-all text-xs font-semibold text-slate-600">
            {toast.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
