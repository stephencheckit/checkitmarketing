import Link from 'next/link';
import { FileText, ArrowRight, Calendar, Clock } from 'lucide-react';
import { getPublishedArticles } from '@/lib/db';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ResourcesPage() {
  const articles = await getPublishedArticles(50);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-purple-500/5" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Resources & Guides
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Expert insights on temperature monitoring, food safety compliance, and operational excellence.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-muted mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Resources Coming Soon
              </h2>
              <p className="text-muted max-w-md mx-auto">
                We&apos;re working on comprehensive guides to help you improve your operations. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/resources/${article.slug}`}
                  className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5"
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted mb-3">
                      <Calendar className="w-3 h-3" />
                      {article.published_at 
                        ? new Date(article.published_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Recently Published'}
                    </div>
                    
                    <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                      {article.title}
                    </h2>
                    
                    {article.excerpt && (
                      <p className="text-muted text-sm line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Keywords */}
                    {article.target_keywords && (article.target_keywords as string[]).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(article.target_keywords as string[]).slice(0, 3).map((kw, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-accent text-sm font-medium">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-muted mb-8">
            See how Checkit can help you automate compliance and reduce operational risk.
          </p>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
          >
            Learn About Checkit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
