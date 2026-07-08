'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Handshake,
  Mail,
  Building2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface HubSpotContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  jobTitle: string;
  lifecycleStage: string;
  leadStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface HubSpotDeal {
  id: string;
  name: string;
  amount: string;
  stage: string;
  pipeline: string;
  ownerName: string;
  closeDate: string;
  createdAt: string;
  updatedAt: string;
}

type Tab = 'contacts' | 'deals';

function formatDate(value: string) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatAmount(value: string) {
  if (!value) return '-';
  const n = Number(value);
  if (isNaN(n)) return value;
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function AdminHubSpotPage() {
  const [tab, setTab] = useState<Tab>('contacts');
  const [contacts, setContacts] = useState<HubSpotContact[]>([]);
  const [deals, setDeals] = useState<HubSpotDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/hubspot');
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to load HubSpot data');
        return;
      }
      setContacts(data.contacts || []);
      setDeals(data.deals || []);
      if (!data.success && data.error) {
        setError(data.error === 'No token configured'
          ? 'HubSpot is not configured (missing access token).'
          : data.error);
      }
    } catch {
      setError('Failed to load HubSpot data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Handshake className="w-7 h-7 text-accent" />
            HubSpot
          </h1>
          <p className="text-sm text-muted mt-1">
            Live contacts and deals pulled from HubSpot CRM
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setTab('contacts')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
            tab === 'contacts'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          Contacts ({contacts.length})
        </button>
        <button
          onClick={() => setTab('deals')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
            tab === 'deals'
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          <Handshake className="w-4 h-4" />
          Deals ({deals.length})
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-accent" />
        </div>
      )}

      {/* Contacts */}
      {!loading && tab === 'contacts' && (
        contacts.length === 0 ? (
          <EmptyState icon={<Users className="w-12 h-12 text-muted mx-auto mb-4" />} label="No contacts found" />
        ) : (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Company</Th>
                    <Th>Job Title</Th>
                    <Th>Lifecycle</Th>
                    <Th>Lead Status</Th>
                    <Th>Created</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-background/50">
                      <td className="p-4 font-medium">{[c.firstName, c.lastName].filter(Boolean).join(' ') || '-'}</td>
                      <td className="p-4 text-sm text-muted">
                        {c.email ? (
                          <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-accent">
                            <Mail className="w-3 h-3" />
                            {c.email}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-sm">{c.company || '-'}</td>
                      <td className="p-4 text-sm text-muted">{c.jobTitle || '-'}</td>
                      <td className="p-4 text-sm capitalize">{c.lifecycleStage || '-'}</td>
                      <td className="p-4 text-sm">{c.leadStatus || '-'}</td>
                      <td className="p-4 text-sm text-muted">{formatDate(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Deals */}
      {!loading && tab === 'deals' && (
        deals.length === 0 ? (
          <EmptyState icon={<Handshake className="w-12 h-12 text-muted mx-auto mb-4" />} label="No deals found" />
        ) : (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <Th>Deal</Th>
                    <Th>Amount</Th>
                    <Th>Stage</Th>
                    <Th>Owner</Th>
                    <Th>Close Date</Th>
                    <Th>Created</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {deals.map((d) => (
                    <tr key={d.id} className="hover:bg-background/50">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted shrink-0" />
                        {d.name || '-'}
                      </td>
                      <td className="p-4 text-sm">{formatAmount(d.amount)}</td>
                      <td className="p-4 text-sm">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-accent/10 text-accent">
                          {d.stage || '-'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted">{d.ownerName || '-'}</td>
                      <td className="p-4 text-sm text-muted">{formatDate(d.closeDate)}</td>
                      <td className="p-4 text-sm text-muted">{formatDate(d.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left p-4 text-sm font-medium text-muted whitespace-nowrap">{children}</th>;
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="text-center py-16 bg-surface border border-border rounded-xl">
      {icon}
      <h2 className="text-xl font-semibold text-foreground mb-2">{label}</h2>
      <p className="text-muted">Recently modified records will appear here.</p>
    </div>
  );
}
