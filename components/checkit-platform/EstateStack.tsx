import { ArrowUp, Check, Database, Network, Radio, Sparkles } from 'lucide-react';

const layers = [
  { icon: Database, title: 'Your monitoring history', note: 'Historical records migrate with you', tag: 'Comes with you' },
  { icon: Network, title: 'Your network and infrastructure', note: 'Gateways and connectivity stay in place', tag: 'Stays' },
  { icon: Radio, title: 'Your sensors', note: 'The hardware already on your assets', tag: 'Stays' },
];

export default function EstateStack() {
  return (
    <div className="relative" role="img" aria-label="Diagram: the platform layer moves from CAM+ to the Checkit Platform while sensors, infrastructure and history stay in place">
      <div className="relative rounded-2xl border border-accent/50 bg-linear-to-br from-accent/20 via-accent/10 to-transparent p-5 shadow-[0_0_40px_rgba(59,130,246,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-accent font-semibold">Platform</p>
              <p className="text-lg font-semibold text-foreground">Checkit Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2.5 py-1 rounded-md bg-background/60 border border-border text-muted line-through decoration-muted/60">
              CAM+
            </span>
            <ArrowUp className="w-4 h-4 text-accent rotate-90" />
            <span className="px-2.5 py-1 rounded-md bg-accent/20 border border-accent/40 text-foreground font-medium whitespace-nowrap">Checkit Platform</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-foreground/75">The only layer that changes.</p>
      </div>

      <div className="flex justify-center py-2" aria-hidden="true">
        <div className="flex gap-6">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-px h-6 bg-linear-to-b from-accent/70 to-border" />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {layers.map((layer) => {
          const Icon = layer.icon;
          return (
            <div key={layer.title} className="flex items-center gap-4 rounded-2xl border border-border bg-background px-5 py-4">
              <span className="w-10 h-10 rounded-xl bg-surface-elevated text-foreground flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{layer.title}</p>
                <p className="text-sm text-muted">{layer.note}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/10 text-green-300 border border-green-500/20 shrink-0">
                <Check className="w-3 h-3" />
                {layer.tag}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
