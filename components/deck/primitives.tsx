export function StatCard({
  label,
  value,
  sub,
  tone = 'accent',
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'accent' | 'success' | 'warning' | 'error';
}) {
  const toneMap = {
    accent: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-300',
    success: 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-300',
    warning: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-300',
    error: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-300',
  } as const;
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${toneMap[tone]} p-5 backdrop-blur-sm`}>
      <div className="text-xs uppercase tracking-widest text-muted">{label}</div>
      <div className="mt-2 text-3xl font-bold text-foreground">{value}</div>
      {sub && <div className="mt-1 text-sm text-muted">{sub}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function Callout({ tone = 'success', children }: { tone?: 'success' | 'warning' | 'accent'; children: React.ReactNode }) {
  const map = {
    success: 'border-green-500/30 bg-green-500/5 text-green-200',
    warning: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-200',
    accent: 'border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent text-foreground/90',
  } as const;
  return <div className={`rounded-xl border p-4 text-sm ${map[tone]}`}>{children}</div>;
}
