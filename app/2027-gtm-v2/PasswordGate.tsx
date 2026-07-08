import { Lock } from 'lucide-react';

export default function PasswordGate({ error }: { error?: boolean }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface/60 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/15 p-2 text-blue-300">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-300">Restricted</div>
            <h1 className="text-xl font-semibold text-foreground">2027 GTM · v2</h1>
          </div>
        </div>
        <p className="mb-6 text-sm text-muted">
          This deck is private. Enter the access password to continue.
        </p>
        <form method="POST" action="/api/2027-gtm-v2/auth" className="space-y-3">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Password"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-blue-500 focus:outline-none"
          />
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              Incorrect password.
            </div>
          )}
          <button
            type="submit"
            className="btn-gradient w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
