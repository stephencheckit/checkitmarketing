import { Unlink, type LucideIcon } from 'lucide-react';

export interface FlowItem {
  icon: LucideIcon;
  label: string;
  note: string;
}

export default function FragmentedVsConnected({ today, connected }: { today: FlowItem[]; connected: FlowItem[] }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
      <div className="rounded-2xl border border-border bg-surface/60 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Today</p>
          <span className="text-xs text-muted">Split across people, systems and paper</span>
        </div>
        <ol>
          {today.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <div
                  className={`flex items-center gap-3 rounded-xl border border-dashed border-border bg-background/60 px-4 py-3 w-[88%] ${
                    i % 2 === 1 ? 'ml-auto' : ''
                  } ${i % 2 === 1 ? 'rotate-[0.6deg]' : '-rotate-[0.6deg]'}`}
                >
                  <span className="w-8 h-8 rounded-lg bg-surface-elevated text-muted flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted">{item.note}</p>
                  </div>
                </div>
                {i < today.length - 1 && (
                  <div className="flex justify-center py-1.5" aria-hidden="true">
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-300/80">
                      <Unlink className="w-3 h-3" />
                      manual hand-off
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="relative rounded-2xl border border-accent/40 bg-linear-to-b from-accent/10 to-accent/[0.02] p-6 lg:p-8 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/15 blur-3xl rounded-full" aria-hidden="true" />
        <div className="relative flex items-center justify-between mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">With the Checkit Platform</p>
          <span className="text-xs text-foreground/70">One connected record</span>
        </div>
        <ol className="relative">
          <span
            className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-linear-to-b from-accent via-accent to-green-400"
            aria-hidden="true"
          />
          {connected.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="relative flex items-center gap-4 py-2.5">
                <span className="relative z-10 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shrink-0 ring-4 ring-background">
                  <Icon className="w-4 h-4" />
                </span>
                <div className="flex-1 rounded-xl border border-accent/25 bg-background/70 px-4 py-2.5">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted">{item.note}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
