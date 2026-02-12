import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, ArrowRight } from 'lucide-react';
import { getPublishedArticleBySlug, getPublishedArticles } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Always fetch fresh content from DB

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  
  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${article.title} | Checkit Resources`,
    description: article.meta_description || article.excerpt || `Learn about ${article.title}`,
  };
}

// Convert markdown-like content to HTML
function formatContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-foreground mt-8 mb-4">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-foreground mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-foreground mt-10 mb-6">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Bullet lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-2">$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-2 list-decimal">$1</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="text-muted mb-4">')
    // Single newlines within content
    .replace(/\n/g, '<br/>');
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article || !article.content) {
    notFound();
  }

  // Get related articles
  const allArticles = await getPublishedArticles(10);
  const relatedArticles = allArticles
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  const formattedContent = formatContent(article.content);

  return (
    <div className="min-h-screen bg-background">
      {/* Article Header */}
      <section className="relative py-16 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            href="/resources"
            className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
            {article.published_at && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Keywords */}
          {article.target_keywords && (article.target_keywords as string[]).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(article.target_keywords as string[]).map((kw, i) => (
                <span 
                  key={i} 
                  className="flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div 
            className="prose prose-lg prose-invert max-w-none
              [&>p]:text-muted [&>p]:mb-4 [&>p]:leading-relaxed
              [&>h2]:text-foreground [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4
              [&>h3]:text-foreground [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4
              [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4
              [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4
              [&>li]:text-muted [&>li]:mb-2
              [&>blockquote]:border-l-4 [&>blockquote]:border-accent [&>blockquote]:pl-4 [&>blockquote]:italic"
            dangerouslySetInnerHTML={{ __html: `<p class="text-muted mb-4">${formattedContent}</p>` }}
          />
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-12 bg-accent/5 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Improve Your Operations?
          </h2>
          <p className="text-muted mb-6 max-w-2xl mx-auto">
            Checkit helps food service and healthcare organizations automate compliance, 
            monitor temperatures, and reduce operational risk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/platform"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Learn About Checkit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/industries"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-border text-foreground rounded-lg font-medium hover:bg-surface-elevated transition-colors"
            >
              View Industries We Serve
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 border-t border-border">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Related Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/resources/${related.slug}`}
                  className="group p-4 bg-surface border border-border rounded-lg hover:border-accent/50 transition-all"
                >
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  {related.excerpt && (
                    <p className="text-sm text-muted line-clamp-2">
                      {related.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
