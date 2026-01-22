import { getSession } from '@/lib/session';
import { startModule, completeModule, getUserProgress } from '@/lib/db';
import { MODULES } from '@/lib/modules';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import ModuleContent from '@/components/ModuleContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModulePage({ params }: PageProps) {
  const { slug } = await params;
  const session = await getSession();
  
  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  const module = MODULES.find(m => m.slug === slug);
  if (!module) {
    notFound();
  }

  // Mark module as started
  await startModule(session.userId, slug);

  const progress = await getUserProgress(session.userId);
  const moduleProgress = progress.find((p: { module_slug: string }) => p.module_slug === slug);
  const isCompleted = !!moduleProgress?.completed_at;

  const currentIndex = MODULES.findIndex(m => m.slug === slug);
  const nextModule = MODULES[currentIndex + 1];
  const prevModule = MODULES[currentIndex - 1];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/learn" className="hover:text-foreground transition-colors">
          Learn
        </Link>
        <span>/</span>
        <span className="text-foreground">{module.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
            Module {module.order}
          </span>
          <span className="text-xs text-muted">{module.duration}</span>
          {isCompleted && (
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Completed
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-3">{module.title}</h1>
        <p className="text-muted text-lg">{module.description}</p>
      </div>

      {/* Content */}
      <ModuleContent 
        slug={slug} 
        userId={session.userId}
        isCompleted={isCompleted}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
        {prevModule ? (
          <Link
            href={`/learn/${prevModule.slug}`}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{prevModule.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Link
            href={`/learn/${nextModule.slug}`}
            className="flex items-center gap-2 text-accent hover:text-accent-hover transition-colors font-medium"
          >
            <span>{nextModule.title}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link
            href="/quiz"
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <span>Take Quiz</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
