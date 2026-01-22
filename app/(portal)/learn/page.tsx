import { getSession } from '@/lib/session';
import { getUserProgress } from '@/lib/db';
import { MODULES } from '@/lib/modules';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GraduationCap, CheckCircle, Lock, Clock, FileText, ChevronRight } from 'lucide-react';

export default async function LearnPage() {
  const session = await getSession();
  
  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  const progress = await getUserProgress(session.userId);

  const getModuleStatus = (slug: string) => {
    const moduleProgress = progress.find((p) => p.module_slug === slug);
    if (!moduleProgress) return 'not_started';
    if (moduleProgress.completed_at) return 'completed';
    return 'in_progress';
  };

  const completedCount = progress.filter((p) => p.completed_at).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <GraduationCap className="w-7 h-7 text-accent" />
          Learning Modules
        </h1>
        <p className="text-sm text-muted mt-1">
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
              className={`bg-surface border rounded-xl p-5 transition-all ${
                isLocked 
                  ? 'border-border opacity-50 cursor-not-allowed' 
                  : 'border-border hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Status indicator */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  status === 'completed' 
                    ? 'bg-success/20 text-success' 
                    : status === 'in_progress'
                    ? 'bg-accent/20 text-accent'
                    : 'bg-muted/20 text-muted'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <span className="text-lg font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{module.title}</h3>
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
                      <Clock className="w-3.5 h-3.5" />
                      {module.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      Module {index + 1}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                {!isLocked && (
                  <ChevronRight className="w-5 h-5 text-muted" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quiz CTA */}
      {completedCount === MODULES.length && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-5 text-center">
          <h3 className="font-semibold mb-2">All modules complete! 🎉</h3>
          <p className="text-muted text-sm mb-4">You&apos;re ready to take the certification quiz.</p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Take the Quiz
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
