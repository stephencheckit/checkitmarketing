import { getSession } from '@/lib/session';
import { getUserById, getUserProgress, hasUserPassed, getUserQuizAttempts } from '@/lib/db';
import { MODULES } from '@/lib/modules';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LayoutDashboard, BookOpen, AlertTriangle, ChevronRight, Clock, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  const user = await getUserById(session.userId);
  const progress = await getUserProgress(session.userId);
  const certified = await hasUserPassed(session.userId);
  const quizAttempts = await getUserQuizAttempts(session.userId);

  const completedModules = progress.filter((p) => p.completed_at).length;
  const progressPercent = Math.round((completedModules / MODULES.length) * 100);

  const getModuleStatus = (slug: string) => {
    const moduleProgress = progress.find((p) => p.module_slug === slug);
    if (!moduleProgress) return 'not_started';
    if (moduleProgress.completed_at) return 'completed';
    return 'in_progress';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <LayoutDashboard className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
          Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">
          {certified 
            ? "You're V6 certified! Keep your knowledge fresh." 
            : "Complete the modules and pass the quiz to get V6 certified."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted text-sm">Progress</span>
            <span className="text-2xl font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted mt-2">{completedModules} of {MODULES.length} modules</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted text-sm">Quiz Status</span>
            {certified ? (
              <span className="inline-flex items-center gap-1 text-success text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Passed
              </span>
            ) : quizAttempts.length > 0 ? (
              <span className="text-warning text-sm font-medium">Not yet passed</span>
            ) : (
              <span className="text-muted text-sm">Not attempted</span>
            )}
          </div>
          <p className="text-2xl font-bold">
            {quizAttempts.length > 0 
              ? `${quizAttempts[0].score}%` 
              : '—'}
          </p>
          <p className="text-xs text-muted mt-2">
            {quizAttempts.length} attempt{quizAttempts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted text-sm">Certification</span>
          </div>
          {certified ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-success">V6 Ready</p>
                <p className="text-xs text-muted">Certified</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-muted">Not certified</p>
                <p className="text-xs text-muted">Pass the quiz to unlock</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Critical Notice */}
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-warning mb-1">Critical: &quot;Nova UI&quot; is internal only</h3>
            <p className="text-sm text-foreground/80">
              Customers should only hear <strong>&quot;Checkit Platform&quot;</strong>. Never use Nova, Control Center, or CAM/CWM externally.
            </p>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ stroke: 'url(#icon-gradient)' }} />
            Learning Modules
          </h2>
          <Link 
            href="/learn"
            className="text-sm text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid gap-3">
          {MODULES.map((module) => {
            const status = getModuleStatus(module.slug);
            return (
              <Link
                key={module.slug}
                href={`/learn/${module.slug}`}
                className="bg-surface border border-border rounded-xl p-4 hover:border-accent/50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    status === 'completed' 
                      ? 'bg-success/20 text-success' 
                      : status === 'in_progress'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-muted/20 text-muted'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{module.order}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium group-hover:text-accent transition-colors">{module.title}</h3>
                    <p className="text-sm text-muted">{module.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {module.duration}
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      {!certified && completedModules === MODULES.length && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">Ready to get certified?</h3>
          <p className="text-muted text-sm mb-4">You&apos;ve completed all modules. Take the quiz to earn your V6 Ready badge!</p>
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
