import { getSession } from '@/lib/session';
import { startModule, completeModule, getUserProgress } from '@/lib/db';
import { MODULES } from '@/lib/modules';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import ModuleContent from '@/components/ModuleContent';
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';

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
  const moduleProgress = progress.find((p) => p.module_slug === slug);
  const isCompleted = !!moduleProgress?.completed_at;

  const currentIndex = MODULES.findIndex(m => m.slug === slug);
  const nextModule = MODULES[currentIndex + 1];
  const prevModule = MODULES[currentIndex - 1];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/learn" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Learn
        </Link>
        <span>/</span>
        <span className="text-foreground">{module.title}</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
            Module {module.order}
          </span>
          <span className="text-xs text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {module.duration}
          </span>
          {isCompleted && (
            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">{module.title}</h1>
        <p className="text-muted">{module.description}</p>
      </div>

      {/* Content */}
      <ModuleContent 
        slug={slug} 
        userId={session.userId}
        isCompleted={isCompleted}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        {prevModule ? (
          <Link
            href={`/learn/${prevModule.slug}`}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
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
            <ChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <Link
            href="/quiz"
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <span>Take Quiz</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
}
