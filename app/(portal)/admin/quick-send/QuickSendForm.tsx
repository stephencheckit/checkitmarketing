'use client';

import { useEffect, useMemo, useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, Sparkles, Building2, Users, FileText, Mail } from 'lucide-react';
import type { CompanyGroup } from './page';

type SentMap = Record<string, { sentAt: string; resendId?: string }>;

const STORAGE_KEY = 'quick-send-sent-v1';

function loadSentMap(): SentMap {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveSentMap(map: SentMap) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export default function QuickSendForm({ groups }: { groups: CompanyGroup[] }) {
  const allContacts = useMemo(
    () => groups.flatMap((g) => g.contacts.map((c) => ({ ...c, opportunity: g.opportunity }))),
    [groups]
  );

  const [selectedId, setSelectedId] = useState<string | null>(allContacts[0]?.id ?? null);
  const [sentMap, setSentMap] = useState<SentMap>({});
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [extraInstructions, setExtraInstructions] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setSentMap(loadSentMap());
  }, []);

  // Clear draft when switching contacts
  useEffect(() => {
    setSubject('');
    setBody('');
    setExtraInstructions('');
    setStatus(null);
  }, [selectedId]);

  const selected = allContacts.find((c) => c.id === selectedId);
  const selectedGroup = selected ? groups.find((g) => g.company === selected.company) : null;
  const sentCount = Object.keys(sentMap).length;
  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return Object.values(sentMap).filter((s) => s.sentAt.startsWith(today)).length;
  }, [sentMap]);

  async function handleGenerate() {
    if (!selected) return;
    setGenerating(true);
    setStatus(null);
    try {
      const res = await fetch('/api/quick-send/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: selected.id, extraInstructions: extraInstructions || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus({ kind: 'error', message: json.error || 'Generation failed' });
      } else {
        setSubject(json.subject);
        setBody(json.body);
      }
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setGenerating(false);
    }
  }

  async function handleSend() {
    if (!selected || !subject || !body) return;
    if (sentMap[selected.id]) {
      const ok = confirm(`You already sent to ${selected.email}. Send again?`);
      if (!ok) return;
    }
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch('/api/quick-send/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: selected.email, subject, body }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus({ kind: 'error', message: json.error || 'Send failed' });
      } else {
        const newMap = { ...sentMap, [selected.id]: { sentAt: new Date().toISOString(), resendId: json.id } };
        setSentMap(newMap);
        saveSentMap(newMap);
        setStatus({ kind: 'ok', message: `Sent (${json.id})` });
      }
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Send className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
          Quick Send
        </h1>
        <p className="text-sm text-muted mt-1">
          One-at-a-time personalized outreach. From: Stephen Newman &lt;stephen@checkitv6.com&gt; · Reply-To: stephen.newman@checkit.net
        </p>
        <p className="text-xs text-muted mt-1">
          Sent total: <span className="text-foreground font-medium">{sentCount}</span> · Today: <span className="text-foreground font-medium">{todayCount}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Sidebar — contacts list grouped by company */}
        <aside className="bg-card border border-border rounded-lg p-2 max-h-[80vh] overflow-y-auto">
          {groups.map((g) => (
            <div key={g.company} className="mb-3">
              <div className="px-2 py-1 text-xs font-semibold text-muted uppercase tracking-wide flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {g.company}
                {g.opportunity && (
                  <span className="ml-auto text-[10px] text-blue-400 font-normal normal-case tracking-normal">
                    {g.opportunity.stage}
                  </span>
                )}
              </div>
              {g.contacts.map((c) => {
                const isSent = !!sentMap[c.id];
                const isSelected = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-500/20 text-foreground'
                        : 'text-muted hover:bg-background hover:text-foreground'
                    }`}
                  >
                    {isSent ? (
                      <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                    ) : (
                      <Mail className="w-3 h-3 shrink-0 opacity-50" />
                    )}
                    <span className="truncate">{c.email}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Main — context + draft */}
        <main className="space-y-4">
          {!selected && (
            <div className="bg-card border border-border rounded-lg p-6 text-sm text-muted">
              Select a contact from the left to begin.
            </div>
          )}

          {selected && (
            <>
              {/* Context */}
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted uppercase tracking-wide flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {selected.company}
                    </div>
                    <div className="text-lg font-semibold text-foreground mt-0.5">{selected.email}</div>
                  </div>
                  {sentMap[selected.id] && (
                    <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      Sent {new Date(sentMap[selected.id].sentAt).toLocaleString()}
                    </div>
                  )}
                </div>

                {selectedGroup?.opportunity ? (
                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="text-xs text-muted uppercase tracking-wide flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Opportunity context
                    </div>
                    <div className="text-sm text-foreground font-medium">{selectedGroup.opportunity.oppName}</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span>Stage: <span className="text-foreground">{selectedGroup.opportunity.stage}</span></span>
                      <span>Owner: <span className="text-foreground">{selectedGroup.opportunity.owner}</span></span>
                      <span>Amount: <span className="text-foreground">£{selectedGroup.opportunity.amountGbp.toLocaleString()}</span></span>
                    </div>
                    <div className="text-sm text-foreground/90 bg-background/50 border border-border rounded p-2 whitespace-pre-wrap">
                      {selectedGroup.opportunity.notes}
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-border pt-3 text-xs text-muted italic">
                    No opportunity notes on file for {selected.company}.
                  </div>
                )}

                {selectedGroup && selectedGroup.contacts.length > 1 && (
                  <div className="border-t border-border pt-3">
                    <div className="text-xs text-muted uppercase tracking-wide flex items-center gap-1 mb-1">
                      <Users className="w-3 h-3" /> Other contacts at {selected.company}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedGroup.contacts
                        .filter((c) => c.id !== selected.id)
                        .map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setSelectedId(c.id)}
                            className={`text-xs px-2 py-0.5 rounded border ${
                              sentMap[c.id]
                                ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                : 'border-border text-muted hover:text-foreground hover:border-foreground/30'
                            }`}
                          >
                            {c.email}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Draft */}
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Email draft</h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={extraInstructions}
                      onChange={(e) => setExtraInstructions(e.target.value)}
                      placeholder="Optional: extra instructions for this draft"
                      className="w-72 px-2 py-1 text-xs bg-background border border-border rounded text-foreground placeholder:text-muted"
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded font-medium"
                    >
                      {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {generating ? 'Drafting…' : subject ? 'Regenerate' : 'Generate draft'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Click Generate draft, or type your own subject"
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Body (plain text)</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={10}
                    placeholder="Hey {FirstName}-..."
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground font-mono text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted">
                    Sends to <span className="text-foreground">{selected.email}</span>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={sending || !subject || !body}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-medium text-sm"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sending ? 'Sending…' : 'Send'}
                  </button>
                </div>

                {status?.kind === 'ok' && (
                  <div className="flex items-start gap-2 p-2 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <div>{status.message}</div>
                  </div>
                )}
                {status?.kind === 'error' && (
                  <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <div>{status.message}</div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
