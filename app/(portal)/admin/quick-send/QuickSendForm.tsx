'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QuickSendForm() {
  const [to, setTo] = useState('stephen.p.newman@gmail.com');
  const [subject, setSubject] = useState('Test from Checkit Market Hub');
  const [body, setBody] = useState(
    "Hey Stephen-\n\nThis is a quick test. If you're reading this, the send path works and replies should land in stephen.newman@checkit.net.\n\n-Stephen"
  );
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok?: boolean; error?: string; id?: string } | null>(null);

  async function handleSend() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/quick-send/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body }),
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Send className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
          Quick Send (Test)
        </h1>
        <p className="text-sm text-muted mt-1">
          Send a single plain-text test email. From: Stephen Newman &lt;stephen@checkitv6.com&gt;. Replies go to stephen.newman@checkit.net.
        </p>
      </div>

      <div className="space-y-4 bg-card border border-border rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">To</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Body (plain text)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground font-mono text-sm"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={sending || !to || !subject || !body}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md font-medium"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? 'Sending...' : 'Send test'}
        </button>

        {result?.ok && (
          <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-md text-sm text-green-400">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              Sent. Resend id: <code className="text-xs">{result.id}</code>
            </div>
          </div>
        )}
        {result?.error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-sm text-red-400">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>{result.error}</div>
          </div>
        )}
      </div>
    </div>
  );
}
