export function LoadingBoard() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f0e8] text-slate-950">
      <div className="border border-slate-950 bg-white p-6 shadow-[8px_8px_0_#0f172a]">
        Cargando tablero...
      </div>
    </main>
  );
}

export function FirebaseSetup() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f0e8] px-5 text-slate-950">
      <section className="max-w-2xl border border-slate-950 bg-white p-6 shadow-[8px_8px_0_#0f172a]">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#8f3d2b]">
          Firebase pendiente
        </p>
        <h1 className="mt-3 text-4xl font-black">Faltan variables de entorno</h1>
        <p className="mt-4 leading-7 text-slate-700">
          Crea un proyecto en Firebase, activa Authentication con Google y
          Firestore. Luego agrega las variables `NEXT_PUBLIC_FIREBASE_*` en
          `.env.local`.
        </p>
      </section>
    </main>
  );
}

export function SignedOutPanel() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
      <div className="border border-slate-950 bg-white p-6 shadow-[8px_8px_0_#0f172a]">
        <h2 className="text-2xl font-black">Tu tablero privado</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-700">
          Inicia sesion con Google para crear tareas y guardarlas en Firestore
          bajo tu usuario.
        </p>
      </div>
      <div className="border border-slate-950 bg-[#d6f36b] p-6 shadow-[8px_8px_0_#0f172a]">
        <p className="text-sm font-black uppercase tracking-[0.18em]">Auth</p>
        <p className="mt-3 text-sm leading-6 text-slate-800">
          Firebase valida el token de Google y separa los datos por UID.
        </p>
      </div>
    </section>
  );
}
