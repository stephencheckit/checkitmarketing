import { Bell, ClipboardCheck, Gauge, PenLine, Settings2, ShieldCheck, type LucideIcon } from 'lucide-react';

const entries: { icon: LucideIcon; event: string; detail: string; who: string; signed?: boolean }[] = [
  { icon: Settings2, event: 'Threshold changed', detail: 'Upper limit 8.0°C → 7.5°C · reason recorded', who: 'Pharmacy lead', signed: true },
  { icon: Gauge, event: 'Calibration recorded', detail: 'Probe 2 · certificate attached', who: 'Facilities engineer', signed: true },
  { icon: Bell, event: 'Alert acknowledged', detail: 'Vaccine fridge, Ward 4', who: 'Pharmacy on-call' },
  { icon: ClipboardCheck, event: 'Corrective action closed', detail: 'Stock moved and reviewed', who: 'Pharmacy on-call' },
  { icon: PenLine, event: 'Incident approved', detail: 'Reviewed and signed off', who: 'Quality manager', signed: true },
];

export default function AuditTrailMock() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/40 overflow-hidden" role="img" aria-label="Illustration of a Checkit Platform audit trail with attributable, signed entries">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">Audit trail</span>
        </div>
        <span className="text-[11px] text-muted">Who · what · when · why</span>
      </div>
      <ul className="divide-y divide-white/[0.06]">
        {entries.map((entry) => {
          const Icon = entry.icon;
          return (
            <li key={entry.event} className="flex items-center gap-3 px-5 py-3">
              <span className="w-8 h-8 rounded-lg bg-white/[0.05] text-accent flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{entry.event}</p>
                <p className="text-xs text-muted truncate">{entry.detail}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-foreground">{entry.who}</p>
                {entry.signed && (
                  <p className="inline-flex items-center gap-1 text-[10px] text-green-300">
                    <PenLine className="w-3 h-3" />
                    e-signed
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
