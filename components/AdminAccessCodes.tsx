'use client';

import { useState, useEffect } from 'react';
import { Key, Copy, Check, Link as LinkIcon, Mail, RefreshCw } from 'lucide-react';

export default function AdminAccessCodes() {
  const [accessCodes, setAccessCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Get base URL for signup links
    setBaseUrl(window.location.origin);
    fetchAccessCodes();
  }, []);

  const fetchAccessCodes = async () => {
    try {
      const response = await fetch('/api/admin/access-codes');
      const data = await response.json();
      if (response.ok) {
        setAccessCodes(data.accessCodes || []);
      }
    } catch (error) {
      console.error('Failed to fetch access codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getSignupLink = (code: string) => {
    return `${baseUrl}/register?code=${code}`;
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Access & Invites</h3>
        </div>
        <div className="flex items-center justify-center py-6">
          <RefreshCw className="w-5 h-5 animate-spin text-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-accent" />
        <h3 className="font-semibold">Access & Invites</h3>
      </div>

      {/* Access Codes */}
      <div className="mb-5">
        <p className="text-xs text-muted uppercase mb-2">Access Codes</p>
        <div className="space-y-2">
          {accessCodes.map((code) => (
            <div 
              key={code}
              className="flex items-center justify-between bg-surface-elevated rounded-lg p-3"
            >
              <code className="text-sm font-mono text-foreground">{code}</code>
              <button
                onClick={() => copyToClipboard(code, `code-${code}`)}
                className="p-1.5 text-muted hover:text-foreground transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied === `code-${code}` ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-2">
          Codes are set via ACCESS_CODES env variable
        </p>
      </div>

      {/* Invite Links */}
      <div className="border-t border-border pt-4">
        <p className="text-xs text-muted uppercase mb-2">Invite Links</p>
        <p className="text-sm text-muted mb-3">
          Share these links to invite new team members. They&apos;ll need to complete registration.
        </p>
        <div className="space-y-2">
          {accessCodes.map((code) => (
            <div 
              key={`link-${code}`}
              className="bg-surface-elevated rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">Code: {code}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyToClipboard(getSignupLink(code), `link-${code}`)}
                    className="p-1.5 text-muted hover:text-foreground transition-colors cursor-pointer"
                    title="Copy signup link"
                  >
                    {copied === `link-${code}` ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <LinkIcon className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`mailto:?subject=Join Checkit Market Hub&body=You've been invited to join the Checkit Market Hub. Sign up here: ${encodeURIComponent(getSignupLink(code))}`}
                    className="p-1.5 text-muted hover:text-foreground transition-colors cursor-pointer"
                    title="Send via email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getSignupLink(code)}
                  className="flex-1 text-xs bg-surface border border-border rounded px-2 py-1.5 text-muted"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Registration Link */}
      <div className="border-t border-border pt-4 mt-4">
        <p className="text-xs text-muted uppercase mb-2">Registration Page</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={`${baseUrl}/register`}
            className="flex-1 text-sm bg-surface-elevated border border-border rounded-lg px-3 py-2 text-muted"
          />
          <button
            onClick={() => copyToClipboard(`${baseUrl}/register`, 'register')}
            className="p-2 bg-surface-elevated border border-border rounded-lg text-muted hover:text-foreground transition-colors cursor-pointer"
            title="Copy link"
          >
            {copied === 'register' ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-muted mt-2">
          Users will need an access code to complete registration
        </p>
      </div>
    </div>
  );
}
