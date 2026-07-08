'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Vertical, Cadence } from '@/lib/playbook';
import {
  BookOpen,
  Building2,
  Users,
  Target,
  MessageSquare,
  ShieldQuestion,
  Mail,
  Linkedin,
  Phone,
  Copy,
  Check,
  RefreshCw,
  Send,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface ApolloAccountList {
  name: string;
  found: boolean;
  count: number;
  accounts: { id: string; name: string; domain: string | null }[];
}
interface ApolloContactList {
  name: string;
  found: boolean;
  count: number;
}
interface CadenceStatus {
  name: string;
  syncedSequenceId: string | null;
  active: boolean;
}
interface ApolloData {
  accountLists: ApolloAccountList[];
  contactLists: ApolloContactList[];
  cadences: CadenceStatus[];
}

export default function PlaybookView({
  verticals,
  isAdmin,
}: {
  verticals: Vertical[];
  isAdmin: boolean;
}) {
  const [selectedId, setSelectedId] = useState(verticals[0]?.id);
  const vertical = verticals.find((v) => v.id === selectedId) || verticals[0];

  const [apollo, setApollo] = useState<ApolloData | null>(null);
  const [loadingApollo, setLoadingApollo] = useState(false);

  const loadApollo = useCallback(async (verticalId: string) => {
    setLoadingApollo(true);
    setApollo(null);
    try {
      const res = await fetch(`/api/playbook?vertical=${verticalId}`);
      if (res.ok) setApollo(await res.json());
    } catch {
      // Apollo data is enhancement — page works without it
    } finally {
      setLoadingApollo(false);
    }
  }, []);

  useEffect(() => {
    if (vertical) loadApollo(vertical.id);
  }, [vertical?.id, loadApollo]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!vertical) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-accent" />
          Sales Playbook
        </h1>
        <p className="text-sm text-muted mt-1">
          Target accounts, personas, pains, talking points, and cadences by vertical. Account
          lists pull live from Apollo.
        </p>
      </div>

      {/* Vertical selector */}
      <div className="flex flex-wrap gap-2">
        {verticals.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedId(v.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
              v.id === vertical.id
                ? 'bg-accent/15 border-accent/50 text-accent'
                : 'bg-surface border-border text-muted hover:text-foreground hover:border-accent/30'
            }`}
          >
            {v.name}
            <span className="ml-2 text-xs opacity-70">{v.region}</span>
            {v.status === 'exploring' && (
              <span className="ml-2 text-[10px] uppercase tracking-wide bg-yellow-500/15 text-yellow-400 px-1.5 py-0.5 rounded">
                exploring
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <p className="text-sm text-foreground/90 leading-relaxed">{vertical.summary}</p>
      </div>

      {/* Target accounts from Apollo */}
      <Section icon={<Building2 className="w-5 h-5 text-blue-400" />} title="Target Accounts (Apollo)">
        {loadingApollo ? (
          <div className="flex items-center gap-2 text-sm text-muted py-4">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading from Apollo…
          </div>
        ) : !apollo ? (
          <p className="text-sm text-muted py-2">Couldn&apos;t reach Apollo — lists unavailable.</p>
        ) : (
          <div className="space-y-4">
            {vertical.apolloAccountLists.length === 0 && (
              <div className="flex items-start gap-2 text-sm text-yellow-400 bg-yellow-500/10 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  No Apollo account list mapped for this vertical yet — build one in Apollo and add
                  its name to <code className="text-xs">lib/playbook.ts</code>.
                </span>
              </div>
            )}
            {apollo.accountLists.map((list) => (
              <div key={list.name}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-foreground">{list.name}</span>
                  {list.found ? (
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">
                      {list.count} accounts
                    </span>
                  ) : (
                    <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">
                      not found in Apollo
                    </span>
                  )}
                </div>
                {list.accounts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {list.accounts.map((a) => (
                      <span
                        key={a.id}
                        className="text-xs bg-background border border-border rounded-md px-2 py-1 text-foreground/80"
                        title={a.domain || undefined}
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {apollo.contactLists.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted mb-2">BDR contact lists</p>
                <div className="flex flex-wrap gap-1.5">
                  {apollo.contactLists.map((l) => (
                    <span
                      key={l.name}
                      className={`text-xs rounded-md px-2 py-1 border ${
                        l.found
                          ? 'bg-background border-border text-foreground/80'
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}
                    >
                      {l.name} {l.found ? `· ${l.count}` : '· not found'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Personas */}
      <Section icon={<Users className="w-5 h-5 text-green-400" />} title="Personas & Pains">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {vertical.personas.map((p) => (
            <div key={p.title} className="bg-background border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground">{p.title}</h3>
              <p className="text-xs text-muted mt-0.5 mb-3">{p.role}</p>
              <p className="text-xs font-medium text-red-400 uppercase tracking-wide mb-1.5">Pains</p>
              <ul className="space-y-1.5 mb-3">
                {p.pains.map((pain, i) => (
                  <li key={i} className="text-sm text-foreground/85 flex gap-2">
                    <span className="text-red-400/60 shrink-0">•</span>
                    {pain}
                  </li>
                ))}
              </ul>
              <p className="text-xs font-medium text-success uppercase tracking-wide mb-1.5">
                What a win looks like
              </p>
              <ul className="space-y-1.5">
                {p.caresAbout.map((c, i) => (
                  <li key={i} className="text-sm text-foreground/85 flex gap-2">
                    <span className="text-success/60 shrink-0">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Use cases + proof points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section icon={<Target className="w-5 h-5 text-purple-400" />} title="Use Cases">
          <ul className="space-y-2.5">
            {vertical.useCases.map((u) => (
              <li key={u.name} className="text-sm">
                <span className="font-medium text-foreground">{u.name}</span>
                <span className="text-muted"> — {u.detail}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section icon={<CheckCircle2 className="w-5 h-5 text-success" />} title="Proof Points">
          <ul className="space-y-2.5">
            {vertical.proofPoints.map((p, i) => (
              <li key={i} className="text-sm text-foreground/85 flex gap-2">
                <span className="text-success/60 shrink-0">•</span>
                {p}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Talking points */}
      <Section icon={<MessageSquare className="w-5 h-5 text-accent" />} title="Talking Points">
        <ul className="space-y-2.5">
          {vertical.talkingPoints.map((t, i) => (
            <li key={i} className="text-sm text-foreground/85 flex gap-2">
              <span className="text-accent/60 shrink-0">{i + 1}.</span>
              {t}
            </li>
          ))}
        </ul>
      </Section>

      {/* Objections */}
      <Section icon={<ShieldQuestion className="w-5 h-5 text-orange-400" />} title="Objection Handling">
        <div className="space-y-3">
          {vertical.objections.map((o, i) => (
            <div key={i} className="bg-background border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-orange-300">&ldquo;{o.objection}&rdquo;</p>
              <p className="text-sm text-foreground/85 mt-1.5">{o.response}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Cadences */}
      <Section icon={<Mail className="w-5 h-5 text-blue-400" />} title="Email Cadences">
        {vertical.cadences.length === 0 ? (
          <p className="text-sm text-muted">
            No cadences for this vertical — it&apos;s opportunistic/inbound only for now.
          </p>
        ) : (
          <div className="space-y-6">
            {vertical.cadences.map((c) => (
              <CadenceCard
                key={c.name}
                cadence={c}
                verticalId={vertical.id}
                status={apollo?.cadences.find((s) => s.name === c.name) || null}
                isAdmin={isAdmin}
                onSynced={() => loadApollo(vertical.id)}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

const CHANNEL_ICON = {
  email: <Mail className="w-3.5 h-3.5" />,
  linkedin: <Linkedin className="w-3.5 h-3.5" />,
  call: <Phone className="w-3.5 h-3.5" />,
};

function CadenceCard({
  cadence,
  verticalId,
  status,
  isAdmin,
  onSynced,
}: {
  cadence: Cadence;
  verticalId: string;
  status: { syncedSequenceId: string | null; active: boolean } | null;
  isAdmin: boolean;
  onSynced: () => void;
}) {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const synced = !!status?.syncedSequenceId;

  const sync = async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch('/api/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verticalId, cadenceName: cadence.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSyncError(data.error || 'Sync failed');
      } else {
        onSynced();
      }
    } catch {
      setSyncError('Sync failed — network error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-background/50 border-b border-border">
        <div>
          <h3 className="font-medium text-foreground">{cadence.name}</h3>
          <p className="text-xs text-muted mt-0.5">
            Persona: {cadence.persona} · {cadence.steps.length} steps
          </p>
        </div>
        <div className="flex items-center gap-2">
          {synced ? (
            <a
              href={`https://app.apollo.io/#/sequences/${status!.syncedSequenceId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-success/15 text-success px-3 py-1.5 rounded-lg hover:bg-success/25 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              In Apollo{status!.active ? ' · active' : ' · inactive'}
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : isAdmin ? (
            <button
              onClick={sync}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 text-xs bg-accent/15 text-accent px-3 py-1.5 rounded-lg hover:bg-accent/25 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {syncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Sync to Apollo
            </button>
          ) : null}
        </div>
      </div>
      {syncError && (
        <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 px-4 py-2.5 border-b border-border">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          {syncError}
        </div>
      )}
      <div className="divide-y divide-border">
        {cadence.steps.map((step, i) => (
          <CadenceStepRow key={i} index={i} step={step} />
        ))}
      </div>
    </div>
  );
}

function CadenceStepRow({
  index,
  step,
}: {
  index: number;
  step: Cadence['steps'][number];
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(`Subject: ${step.subject}\n\n${step.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer group"
        >
          <span className="shrink-0 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-xs text-muted">
            {index + 1}
          </span>
          <span className="shrink-0 inline-flex items-center gap-1 text-xs text-muted bg-background border border-border rounded px-1.5 py-0.5">
            {CHANNEL_ICON[step.channel]}
            {step.channel}
          </span>
          <span className="text-xs text-muted shrink-0">
            {step.waitDays === 0 ? 'day 0' : `+${step.waitDays}d`}
          </span>
          <span className="text-sm text-foreground truncate group-hover:text-accent transition-colors">
            {step.subject}
          </span>
        </button>
        <button
          onClick={copy}
          className="shrink-0 p-1.5 rounded-md text-muted hover:text-foreground hover:bg-background transition-colors cursor-pointer"
          title="Copy subject + body"
        >
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      {expanded && (
        <pre className="mt-3 ml-9 text-sm text-foreground/85 whitespace-pre-wrap font-sans bg-background border border-border rounded-lg p-4">
          {step.body}
        </pre>
      )}
    </div>
  );
}
