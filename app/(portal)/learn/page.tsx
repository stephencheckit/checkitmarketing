import { getSession } from '@/lib/session';
import { getUserProgress } from '@/lib/db';
import { MODULES } from '@/lib/modules';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function LearnPage() {
  const session = await getSession();
  
  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  const progress = await getUserProgress(session.userId);

  const getModuleStatus = (slug: string) => {
    const moduleProgress = progress.find((p: { module_slug: string }) => p.module_slug === slug);
    if (!moduleProgress) return 'not_started';
    if (moduleProgress.completed_at) return 'completed';
    return 'in_progress';
  };

  const completedCount = progress.filter((p: { completed_at: string | null }) => p.completed_at).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Learning Modules</h1>
        <p className="text-muted">
          Complete all {MODULES.length} modules to prepare for the certification quiz.
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted">{completedCount} of {MODULES.length} complete</span>
        </div>
        <div className="h-3 bg-background rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${(completedCount / MODULES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Modules grid */}
      <div className="grid gap-4">
        {MODULES.map((module, index) => {
          const status = getModuleStatus(module.slug);
          const isLocked = false; // Could implement sequential unlocking
          
          return (
            <Link
              key={module.slug}
              href={isLocked ? '#' : `/learn/${module.slug}`}
              className={`bg-surface border rounded-xl p-6 transition-all ${
                isLocked 
                  ? 'border-border opacity-50 cursor-not-allowed' 
                  : 'border-border hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5'
              }`}
            >
              <div className="flex items-start gap-5">
                {/* Status indicator */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  status === 'completed' 
                    ? 'bg-success/20 text-success' 
                    : status === 'in_progress'
                    ? 'bg-accent/20 text-accent'
                    : 'bg-muted/20 text-muted'
                }`}>
                  {status === 'completed' ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : isLocked ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <span className="text-lg font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg">{module.title}</h3>
                    {status === 'completed' && (
                      <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                    {status === 'in_progress' && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-muted text-sm mb-3">{module.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {module.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Module {index + 1}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                {!isLocked && (
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quiz CTA */}
      {completedCount === MODULES.length && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">All modules complete! 🎉</h3>
          <p className="text-muted text-sm mb-4">You&apos;re ready to take the certification quiz.</p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Take the Quiz
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
