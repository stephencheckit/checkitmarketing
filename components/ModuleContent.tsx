'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ModuleContentProps {
  slug: string;
  userId: number;
  isCompleted: boolean;
}

export default function ModuleContent({ slug, userId, isCompleted }: ModuleContentProps) {
  const router = useRouter();
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleSlug: slug, action: 'complete' }),
      });
      setCompleted(true);
      router.refresh();
    } catch (error) {
      console.error('Failed to complete module:', error);
    } finally {
      setCompleting(false);
    }
  };

  // Content for each module
  const content: Record<string, React.ReactNode> = {
    naming: <NamingContent />,
    'talk-tracks': <TalkTracksContent />,
    'platform-tour': <PlatformTourContent />,
    objections: <ObjectionsContent />,
    migration: <MigrationContent />,
  };

  return (
    <div className="space-y-8">
      <article className="prose prose-invert prose-lg max-w-none">
        {content[slug] || <p>Content coming soon...</p>}
      </article>

      {/* Complete button */}
      {!completed && (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <p className="text-muted mb-4">Finished reading? Mark this module as complete.</p>
          <button
            onClick={handleComplete}
            disabled={completing}
            className="inline-flex items-center gap-2 bg-success hover:bg-success/80 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {completing ? (
              'Saving...'
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark as Complete
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function NamingContent() {
  return (
    <>
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-6 not-prose mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-warning mb-1">Critical Point</h3>
            <p className="text-foreground">&quot;Nova UI&quot; is an <strong>internal label only</strong>. Customers should never hear this term.</p>
          </div>
        </div>
      </div>

      <h2>Key Terms</h2>
      
      <div className="not-prose grid gap-4 my-6">
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">Internal</span>
            <h4 className="font-semibold">Nova UI</h4>
          </div>
          <p className="text-muted text-sm">Internal label for the new UI/UX layer (BETA / design system). Never use externally.</p>
        </div>
        
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded">Customer-Facing</span>
            <h4 className="font-semibold">Checkit Platform</h4>
          </div>
          <p className="text-muted text-sm">The customer-facing name for the web experience. This is what apps/devices connect to.</p>
        </div>
        
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-error/20 text-error px-2 py-0.5 rounded">Deprecated</span>
            <h4 className="font-semibold">Control Center</h4>
          </div>
          <p className="text-muted text-sm">Legacy terminology we should phase out. Do not use in customer communications.</p>
        </div>
        
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-error/20 text-error px-2 py-0.5 rounded">Deprecated</span>
            <h4 className="font-semibold">CAM/CWM</h4>
          </div>
          <p className="text-muted text-sm">Legacy acronym terminology we should avoid externally. Invoicing/SKUs can remain for now if needed.</p>
        </div>
      </div>

      <h2>What NOT to Say</h2>
      
      <div className="not-prose my-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <h4 className="font-semibold text-error mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Don&apos;t Say
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-error">✗</span>
                <span>&quot;Control Center is now Nova&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-error">✗</span>
                <span>&quot;Checkit website&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-error">✗</span>
                <span>&quot;Nova is the name of the whole product&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-error">✗</span>
                <span>&quot;New CAM/CWM UI&quot;</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Say Instead
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>&quot;The new Checkit Platform experience&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>&quot;Checkit Platform&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>&quot;V6 platform release&quot; (marketing)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>&quot;The updated platform UI&quot;</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Complete Naming Reference</h2>
      
      <h3>Checkit Platform</h3>
      <p>The ecosystem layer: web + apps + devices + add-ons</p>
      <ul>
        <li>Dashboard</li>
        <li>Alerts</li>
        <li>Reports / Work</li>
        <li>Management (Teams, Locations, Users, Work Schedules, Work)</li>
        <li>Monitoring (Status, Rules, Monitors)</li>
        <li>Devices (Handhelds, Hubs, Sensors, Repeaters)</li>
        <li>Documents</li>
      </ul>

      <h3>Checkit Apps</h3>
      <ul>
        <li>Checkit Mobile App (iOS)</li>
        <li>Checkit Mobile App (Android)</li>
      </ul>

      <h3>Checkit Devices</h3>
      <ul>
        <li>Sensors</li>
        <li>Handhelds (Ulephone, Motorola, or customer-managed)</li>
        <li>Hubs</li>
        <li>Repeaters</li>
      </ul>
      
      <p><strong>Note:</strong> Hardware should stay plainly described as sensors/devices — no extra naming layers.</p>
    </>
  );
}

function TalkTracksContent() {
  return (
    <>
      <h2>Positioning V6</h2>
      <p>We are releasing the new V6 platform. <strong>V6 = internal + marketing version marker</strong>. Customers access it and should call it simply the <strong>Checkit Platform</strong>.</p>
      
      <p>Over time we should stop hearing CAM/CWM + Control Center altogether.</p>

      <h2>Example Phrases</h2>
      
      <div className="not-prose space-y-3 my-6">
        <CopyablePhrase text="When you log into the Checkit Platform you'll immediately see your dashboard with recent alerts and monitoring charts." />
        <CopyablePhrase text="The Checkit Platform is where you manage users/teams, create work, connect devices/apps, and report." />
        <CopyablePhrase text="Asset Intelligence can be enabled on the Checkit Platform as an add-on (effectively 'flip a switch')." />
      </div>

      <h2>New Prospects vs. Existing Customers</h2>
      
      <h3>New Prospects / New Logos</h3>
      <ul>
        <li>Demo/sell <strong>Checkit</strong> (Platform + apps + devices)</li>
        <li>No Control Center vs Nova explanation required</li>
        <li>Unless we want to message &quot;new V6 platform release&quot; as a selling point</li>
      </ul>

      <h3>Existing Customers</h3>
      <ul>
        <li>Position as a <strong>migration</strong> to the new Checkit Platform experience</li>
        <li>Provide runway: beta → feedback → optional adoption → planned switchover</li>
        <li>Emphasize benefits/readiness (avoid &quot;replacement&quot; language)</li>
        <li>Legacy experience remains available during transition (no sudden cutoff)</li>
      </ul>
    </>
  );
}

function CopyablePhrase({ text }: { text: string }) {
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
        className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1 flex-shrink-0"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  );
}

function PlatformTourContent() {
  return (
    <>
      <h2>Platform Overview</h2>
      <p>The Checkit Platform is the central hub where customers manage their entire operation. Here&apos;s what they&apos;ll find:</p>
      
      <h3>Dashboard</h3>
      <p>The first thing users see after logging in. Shows recent alerts, monitoring charts, and quick access to common tasks.</p>

      <h3>Alerts</h3>
      <p>Real-time notifications about temperature excursions, missed tasks, device issues, and other critical events.</p>

      <h3>Reports / Work</h3>
      <p>View and generate reports on compliance, task completion, temperature logs, and more. Schedule and track work assignments.</p>

      <h3>Management</h3>
      <ul>
        <li><strong>Teams</strong> - Organize users into functional groups</li>
        <li><strong>Locations</strong> - Define physical sites and zones</li>
        <li><strong>Users</strong> - Add/manage user accounts and permissions</li>
        <li><strong>Work Schedules</strong> - Set up recurring tasks and checklists</li>
      </ul>

      <h3>Monitoring</h3>
      <ul>
        <li><strong>Status</strong> - Live view of all monitored assets</li>
        <li><strong>Rules</strong> - Configure alert thresholds and escalations</li>
        <li><strong>Monitors</strong> - Manage connected sensors and devices</li>
      </ul>

      <h3>Devices</h3>
      <ul>
        <li><strong>Handhelds</strong> - Mobile devices for task completion</li>
        <li><strong>Hubs</strong> - Gateway devices connecting sensors to cloud</li>
        <li><strong>Sensors</strong> - Temperature, humidity, and other probes</li>
        <li><strong>Repeaters</strong> - Range extenders for sensor networks</li>
      </ul>

      <h3>Documents</h3>
      <p>Store and access SOPs, compliance certificates, calibration records, and other documentation.</p>
    </>
  );
}

function ObjectionsContent() {
  return (
    <>
      <h2>Common Objections & Responses</h2>
      
      <div className="not-prose space-y-6 my-6">
        <ObjectionCard 
          objection="Is this the new Control Center?"
          response="This is the Checkit Platform — a completely modernized experience. You'll find it much faster and easier to use than before."
        />
        
        <ObjectionCard 
          objection="We're happy with the current system. Why change?"
          response="The new platform isn't a forced change — it's an upgrade that's available when you're ready. Many customers find the new interface significantly faster and more intuitive. Your current experience remains available during the transition."
        />
        
        <ObjectionCard 
          objection="What happened to CAM/CWM?"
          response="We've unified everything under the Checkit Platform to make it simpler. All the functionality you rely on is there — just with a cleaner, more modern interface."
        />
        
        <ObjectionCard 
          objection="Will my data transfer over?"
          response="Absolutely. All your historical data, configurations, and settings carry over automatically. This is an interface upgrade, not a new system."
        />
        
        <ObjectionCard 
          objection="How long do we have to learn the new system?"
          response="We provide a migration runway with beta access, training resources, and support. You can explore at your own pace before fully switching over."
        />
      </div>
    </>
  );
}

function ObjectionCard({ objection, response }: { objection: string; response: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="bg-error/5 border-b border-border px-4 py-3">
        <p className="font-medium text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-error" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          &quot;{objection}&quot;
        </p>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted mb-3">{response}</p>
        <button
          onClick={handleCopy}
          className="text-xs text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy response
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function MigrationContent() {
  return (
    <>
      <h2>Migration Messaging</h2>
      
      <p>When discussing the transition with existing customers, frame it positively and provide clear timelines.</p>

      <h3>Key Principles</h3>
      <ul>
        <li><strong>It&apos;s a migration, not a replacement</strong> — Avoid language that suggests forced change</li>
        <li><strong>Provide runway</strong> — Beta access → feedback → optional adoption → planned switchover</li>
        <li><strong>Emphasize benefits</strong> — Faster, cleaner, more intuitive</li>
        <li><strong>No sudden cutoff</strong> — Legacy experience remains available during transition</li>
      </ul>

      <h3>Migration Timeline Messaging</h3>
      
      <div className="not-prose my-6">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="relative pl-12 pb-8">
            <div className="absolute left-2.5 w-3 h-3 bg-accent rounded-full"></div>
            <h4 className="font-semibold mb-1">Phase 1: Beta Access</h4>
            <p className="text-sm text-muted">Early access for interested customers. Gather feedback and refine experience.</p>
          </div>
          
          <div className="relative pl-12 pb-8">
            <div className="absolute left-2.5 w-3 h-3 bg-accent rounded-full"></div>
            <h4 className="font-semibold mb-1">Phase 2: Optional Adoption</h4>
            <p className="text-sm text-muted">Customers can choose to switch when ready. Both experiences available.</p>
          </div>
          
          <div className="relative pl-12 pb-8">
            <div className="absolute left-2.5 w-3 h-3 bg-accent rounded-full"></div>
            <h4 className="font-semibold mb-1">Phase 3: Planned Switchover</h4>
            <p className="text-sm text-muted">Announced transition date with ample notice and support.</p>
          </div>
          
          <div className="relative pl-12">
            <div className="absolute left-2.5 w-3 h-3 bg-success rounded-full"></div>
            <h4 className="font-semibold mb-1">Complete</h4>
            <p className="text-sm text-muted">All customers on new Checkit Platform experience.</p>
          </div>
        </div>
      </div>

      <h3>Versioning & Release Notes</h3>
      <ul>
        <li><strong>V6</strong> is primarily an internal/operational marker (line in the sand)</li>
        <li>Externally, frame release notes as improvements to:
          <ul>
            <li>Checkit Platform</li>
            <li>Checkit Mobile Apps (iOS/Android)</li>
          </ul>
        </li>
        <li>Release notes should be structured by component with clear change logs + dates</li>
      </ul>
    </>
  );
}
