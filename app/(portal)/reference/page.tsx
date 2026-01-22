'use client';

import { useState } from 'react';
import { BookMarked, AlertTriangle, X, Check, Copy, CheckCircle } from 'lucide-react';

export default function ReferencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <BookMarked className="w-7 h-7 text-accent" />
          Quick Reference
        </h1>
        <p className="text-sm text-muted mt-1">Essential talking points and naming conventions at a glance.</p>
      </div>

      {/* Critical reminder */}
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-warning mb-1">&quot;Nova UI&quot; is internal only</h3>
            <p className="text-sm text-foreground">Customers should only hear <strong>&quot;Checkit Platform&quot;</strong>. Never use Nova, Control Center, or CAM/CWM externally.</p>
          </div>
        </div>
      </div>

      {/* Do/Don't cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-error/5 border border-error/20 rounded-xl p-5">
          <h3 className="font-semibold text-error mb-4 flex items-center gap-2">
            <X className="w-5 h-5" />
            Don&apos;t Say
          </h3>
          <ul className="space-y-3">
            <DontItem text="Control Center is now Nova" />
            <DontItem text="Checkit website" />
            <DontItem text="Nova is the name of the whole product" />
            <DontItem text="New CAM/CWM UI" />
            <DontItem text="Log into Control Center" />
            <DontItem text="The Nova platform" />
          </ul>
        </div>

        <div className="bg-success/5 border border-success/20 rounded-xl p-5">
          <h3 className="font-semibold text-success mb-4 flex items-center gap-2">
            <Check className="w-5 h-5" />
            Say Instead
          </h3>
          <ul className="space-y-3">
            <DoItem text="Checkit Platform" />
            <DoItem text="The new Checkit Platform experience" />
            <DoItem text="V6 platform release (marketing)" />
            <DoItem text="Log into the Checkit Platform" />
            <DoItem text="Checkit Mobile App" />
            <DoItem text="The updated platform UI" />
          </ul>
        </div>
      </div>

      {/* Copyable phrases */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Copy className="w-5 h-5 text-accent" />
          Ready-to-Use Phrases
        </h2>
        <div className="space-y-3">
          <CopyableCard text="When you log into the Checkit Platform you'll immediately see your dashboard with recent alerts and monitoring charts." />
          <CopyableCard text="The Checkit Platform is where you manage users/teams, create work, connect devices/apps, and report." />
          <CopyableCard text="Asset Intelligence can be enabled on the Checkit Platform as an add-on." />
          <CopyableCard text="This is the Checkit Platform — a completely modernized experience. You'll find it much faster and easier to use." />
          <CopyableCard text="All your historical data, configurations, and settings carry over automatically. This is an interface upgrade, not a new system." />
        </div>
      </div>

      {/* Naming reference */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Official Naming</h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted">Category</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Official Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-4 text-sm">Web Platform</td>
                <td className="p-4 text-sm font-medium">Checkit Platform</td>
                <td className="p-4 text-sm text-muted">Never &quot;Control Center&quot; or &quot;Nova&quot;</td>
              </tr>
              <tr>
                <td className="p-4 text-sm">iOS App</td>
                <td className="p-4 text-sm font-medium">Checkit Mobile App (iOS)</td>
                <td className="p-4 text-sm text-muted">Specify platform in parentheses</td>
              </tr>
              <tr>
                <td className="p-4 text-sm">Android App</td>
                <td className="p-4 text-sm font-medium">Checkit Mobile App (Android)</td>
                <td className="p-4 text-sm text-muted">Specify platform in parentheses</td>
              </tr>
              <tr>
                <td className="p-4 text-sm">Devices</td>
                <td className="p-4 text-sm font-medium">Sensors, Handhelds, Hubs, Repeaters</td>
                <td className="p-4 text-sm text-muted">Plain descriptions, no extra branding</td>
              </tr>
              <tr>
                <td className="p-4 text-sm">Version</td>
                <td className="p-4 text-sm font-medium">V6 (internal/marketing only)</td>
                <td className="p-4 text-sm text-muted">Customers just see &quot;Checkit Platform&quot;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform hierarchy */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Platform Structure</h2>
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Checkit Platform</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-4">
                {['Dashboard', 'Alerts', 'Reports / Work', 'Management', 'Monitoring', 'Devices', 'Documents'].map(item => (
                  <span key={item} className="text-sm text-muted bg-background px-3 py-1.5 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Management</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-4">
                {['Teams', 'Locations', 'Users', 'Work Schedules'].map(item => (
                  <span key={item} className="text-sm text-muted bg-background px-3 py-1.5 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Monitoring</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-4">
                {['Status', 'Rules', 'Monitors'].map(item => (
                  <span key={item} className="text-sm text-muted bg-background px-3 py-1.5 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Devices</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-4">
                {['Handhelds', 'Hubs', 'Sensors', 'Repeaters'].map(item => (
                  <span key={item} className="text-sm text-muted bg-background px-3 py-1.5 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DontItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className="text-error mt-0.5">✗</span>
      <span>&quot;{text}&quot;</span>
    </li>
  );
}

function DoItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className="text-success mt-0.5">✓</span>
      <span>&quot;{text}&quot;</span>
    </li>
  );
}

function CopyableCard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex items-start justify-between gap-4">
      <p className="text-sm">&quot;{text}&quot;</p>
      <button
        onClick={handleCopy}
        className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1 shrink-0"
      >
        {copied ? (
          <>
            <CheckCircle className="w-4 h-4 text-success" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
