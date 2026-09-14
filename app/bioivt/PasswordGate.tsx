import { Lock } from 'lucide-react';

export default function PasswordGate({ error }: { error?: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-[#00cccc]/15 p-2 text-[#00cccc]">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[#00cccc]">Restricted</div>
            <h1 className="text-xl font-semibold">Checkit × BioIVT</h1>
          </div>
        </div>
        <p className="mb-6 text-sm text-white/60">
          This presentation is private. Enter the access password to continue.
        </p>
        <form method="POST" action="/api/bioivt/auth" className="space-y-3">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Password"
            className="w-full rounded-lg border border-white/15 bg-[#020233] px-4 py-2.5 text-white placeholder:text-white/40 focus:border-[#00cccc] focus:outline-none"
          />
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              Incorrect password.
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#00cccc] px-4 py-2.5 text-sm font-semibold text-[#020233] hover:bg-[#00b8b8]"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
