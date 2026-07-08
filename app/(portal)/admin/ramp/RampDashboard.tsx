'use client';

import { useState } from 'react';
import {
  CreditCard,
  Tag,
  Store,
  Receipt,
  ExternalLink,
  Info,
  DollarSign,
} from 'lucide-react';
import type {
  RampTransaction,
  RampSnapshotMeta,
  RampSummary,
  SpendGroup,
} from '@/lib/ramp-snapshot';

type Tab = 'overview' | 'vendors' | 'transactions';

function formatCurrency(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

function formatDate(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RampDashboard({
  meta,
  transactions,
  summary,
  categories,
  vendors,
}: {
  meta: RampSnapshotMeta;
  transactions: RampTransaction[];
  summary: RampSummary;
  categories: SpendGroup[];
  vendors: SpendGroup[];
}) {
  const [tab, setTab] = useState<Tab>('overview');
  const maxCategory = categories[0]?.total || 1;
  const maxVendor = vendors[0]?.total || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-accent" />
          Ramp Spend
        </h1>
        <p className="text-sm text-muted mt-1">
          {meta.scope} · {formatDate(meta.windowStart)} – {formatDate(meta.windowEnd)}
        </p>
      </div>

      {/* Snapshot notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-300">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          Point-in-time snapshot pulled from Ramp on {formatDate(meta.lastUpdated)}. This is not a
          live feed — ask the agent to re-pull to refresh.
          {meta.partial && (
            <>
              {' '}
              Showing <span className="font-semibold">{summary.count}</span> of{' '}
              <span className="font-semibold">{meta.totalAvailable}</span> transactions available in
              the window.
            </>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total spend" value={formatCurrency(summary.total)} icon={<DollarSign className="w-5 h-5" />} highlight />
        <StatCard label="Transactions" value={String(summary.count)} icon={<Receipt className="w-5 h-5" />} />
        <StatCard label="Vendors" value={String(summary.vendorCount)} icon={<Store className="w-5 h-5" />} />
        <StatCard label="Avg / txn" value={formatCurrency(summary.avgTransaction)} icon={<Tag className="w-5 h-5" />} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <TabButton active={tab === 'overview'} onClick={() => setTab('overview')} icon={<Tag className="w-4 h-4" />}>
          By Category
        </TabButton>
        <TabButton active={tab === 'vendors'} onClick={() => setTab('vendors')} icon={<Store className="w-4 h-4" />}>
          By Vendor ({vendors.length})
        </TabButton>
        <TabButton active={tab === 'transactions'} onClick={() => setTab('transactions')} icon={<Receipt className="w-4 h-4" />}>
          Transactions ({transactions.length})
        </TabButton>
      </div>

      {/* By Category */}
      {tab === 'overview' && (
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          {categories.map((c) => {
            const pct = Math.round((c.total / maxCategory) * 100);
            return (
              <div key={c.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{c.key}</span>
                  <span className="text-sm text-muted">
                    {formatCurrency(c.total)} · {c.count} txns
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* By Vendor */}
      {tab === 'vendors' && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <Th>Vendor</Th>
                  <Th>Category</Th>
                  <Th>Spend</Th>
                  <Th>Txns</Th>
                  <Th>Share</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vendors.map((v) => {
                  const pct = Math.round((v.total / maxVendor) * 100);
                  return (
                    <tr key={v.key} className="hover:bg-background/50">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Store className="w-4 h-4 text-muted shrink-0" />
                        {v.key}
                      </td>
                      <td className="p-4 text-sm text-muted">{v.category || '-'}</td>
                      <td className="p-4 text-sm font-medium">{formatCurrency(v.total)}</td>
                      <td className="p-4 text-sm text-muted">{v.count}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-background rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions */}
      {tab === 'transactions' && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <Th>Date</Th>
                  <Th>Merchant</Th>
                  <Th>Category</Th>
                  <Th>Memo</Th>
                  <Th>Amount</Th>
                  <Th>Link</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-background/50">
                    <td className="p-4 text-sm text-muted whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="p-4 font-medium">{t.merchant}</td>
                    <td className="p-4 text-sm">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-accent/10 text-accent">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted">{t.memo || '-'}</td>
                    <td className="p-4 text-sm font-medium whitespace-nowrap">{formatCurrency(t.amount)}</td>
                    <td className="p-4 text-sm">
                      <a href={t.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted hover:text-accent">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
        active ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left p-4 text-sm font-medium text-muted whitespace-nowrap">{children}</th>;
}

function StatCard({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${highlight ? 'bg-accent/10 border-accent/30' : 'bg-surface border-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted text-sm">{label}</span>
        <span className={highlight ? 'text-accent' : 'text-muted'}>{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${highlight ? 'text-accent' : ''}`}>{value}</p>
    </div>
  );
}
