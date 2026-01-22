'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, Linkedin, Facebook, Twitter, ChevronDown, ChevronUp, Target, ListChecks, FileText, X, Loader2 } from 'lucide-react';

interface ContentIdea {
  title: string;
  description: string;
  targetAudience: string;
  keyPoints: string[];
  linkedinPost: string;
  facebookPost: string;
  twitterPost: string;
}

interface GeneratedArticle {
  title: string;
  article: string;
  wordCount: number;
}

interface IdeationResponse {
  ideas: ContentIdea[];
  basedOn: number;
  generatedAt: string;
}

export default function ContentPage() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [basedOn, setBasedOn] = useState<number>(0);
  const [expandedIdeas, setExpandedIdeas] = useState<Set<number>>(new Set([0]));
  
  // Article generation state
  const [generatingArticle, setGeneratingArticle] = useState<number | null>(null);
  const [generatedArticles, setGeneratedArticles] = useState<Record<number, GeneratedArticle>>({});
  const [articleModal, setArticleModal] = useState<number | null>(null);

  const generateIdeas = async () => {
    setLoading(true);
    setError(null);
    setGeneratedArticles({});
    try {
      const res = await fetch('/api/ideate');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate ideas');
      }
      const data: IdeationResponse = await res.json();
      setIdeas(data.ideas);
      setGeneratedAt(data.generatedAt);
      setBasedOn(data.basedOn);
      setExpandedIdeas(new Set([0]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateArticle = async (index: number, idea: ContentIdea) => {
    setGeneratingArticle(index);
    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          targetAudience: idea.targetAudience,
          keyPoints: idea.keyPoints,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate article');
      }
      
      const data: GeneratedArticle = await res.json();
      setGeneratedArticles(prev => ({ ...prev, [index]: data }));
      setArticleModal(index);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate article');
    } finally {
      setGeneratingArticle(null);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedIdeas);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIdeas(newExpanded);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'bg-[#0A66C2] hover:bg-[#004182]';
      case 'facebook': return 'bg-[#1877F2] hover:bg-[#0d5fc7]';
      case 'twitter': return 'bg-black hover:bg-zinc-800';
      default: return 'bg-zinc-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Content Ideation Hub
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            AI-powered content ideas based on Checkit&apos;s blog history. Generate fresh article topics with ready-to-post social content.
          </p>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={generateIdeas}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all text-lg font-medium"
          >
            <Sparkles className={`w-6 h-6 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Analyzing & Generating...' : 'Generate Content Ideas'}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-800 rounded-lg shadow">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-600 dark:text-zinc-400">
                Analyzing {basedOn || '...'} existing articles and generating fresh ideas...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="inline-block px-6 py-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button onClick={() => setError(null)} className="mt-2 text-sm text-red-500 hover:underline">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {ideas.length > 0 && !loading && (
          <>
            <div className="text-center mb-6 text-sm text-zinc-500">
              Generated {ideas.length} ideas based on {basedOn} existing articles
              {generatedAt && ` • ${new Date(generatedAt).toLocaleString()}`}
            </div>

            <div className="space-y-4">
              {ideas.map((idea, index) => {
                const isExpanded = expandedIdeas.has(index);
                const hasArticle = generatedArticles[index];
                const isGenerating = generatingArticle === index;
                
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                  >
                    {/* Idea Header - Always Visible */}
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="w-full p-6 text-left hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-full">
                              {idea.targetAudience}
                            </span>
                            {hasArticle && (
                              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Article Ready
                              </span>
                            )}
                          </div>
                          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                            {idea.title}
                          </h2>
                          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            {idea.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 p-2 text-zinc-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-zinc-200 dark:border-zinc-700">
                        {/* Key Points */}
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <ListChecks className="w-4 h-4 text-blue-600" />
                              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Key Points to Cover</h3>
                            </div>
                            
                            {/* Generate Article Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasArticle) {
                                  setArticleModal(index);
                                } else {
                                  generateArticle(index, idea);
                                }
                              }}
                              disabled={isGenerating}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                hasArticle
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Generating...
                                </>
                              ) : hasArticle ? (
                                <>
                                  <FileText className="w-4 h-4" />
                                  View Article
                                </>
                              ) : (
                                <>
                                  <FileText className="w-4 h-4" />
                                  Generate Article
                                </>
                              )}
                            </button>
                          </div>
                          <ul className="space-y-2">
                            {idea.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <span className="text-blue-600 mt-0.5">•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Social Posts */}
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="w-4 h-4 text-blue-600" />
                            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Ready-to-Post Social Content</h3>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-3">
                            {/* LinkedIn */}
                            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                              <div className="flex items-center justify-between mb-3">
                                <div className={`flex items-center gap-2 px-2 py-1 rounded text-white text-xs ${getPlatformColor('linkedin')}`}>
                                  <Linkedin className="w-3 h-3" />
                                  <span>LinkedIn</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(idea.linkedinPost, `${index}-linkedin`);
                                  }}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                    copiedId === `${index}-linkedin`
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300'
                                  }`}
                                >
                                  {copiedId === `${index}-linkedin` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  {copiedId === `${index}-linkedin` ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <pre className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                                {idea.linkedinPost}
                              </pre>
                              <div className="mt-2 text-xs text-zinc-400">{idea.linkedinPost.length} chars</div>
                            </div>

                            {/* Facebook */}
                            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                              <div className="flex items-center justify-between mb-3">
                                <div className={`flex items-center gap-2 px-2 py-1 rounded text-white text-xs ${getPlatformColor('facebook')}`}>
                                  <Facebook className="w-3 h-3" />
                                  <span>Facebook</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(idea.facebookPost, `${index}-facebook`);
                                  }}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                    copiedId === `${index}-facebook`
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300'
                                  }`}
                                >
                                  {copiedId === `${index}-facebook` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  {copiedId === `${index}-facebook` ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <pre className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                                {idea.facebookPost}
                              </pre>
                              <div className="mt-2 text-xs text-zinc-400">{idea.facebookPost.length} chars</div>
                            </div>

                            {/* Twitter/X */}
                            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
                              <div className="flex items-center justify-between mb-3">
                                <div className={`flex items-center gap-2 px-2 py-1 rounded text-white text-xs ${getPlatformColor('twitter')}`}>
                                  <Twitter className="w-3 h-3" />
                                  <span>X</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(idea.twitterPost, `${index}-twitter`);
                                  }}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                    copiedId === `${index}-twitter`
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300'
                                  }`}
                                >
                                  {copiedId === `${index}-twitter` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  {copiedId === `${index}-twitter` ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <pre className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                                {idea.twitterPost}
                              </pre>
                              <div className="mt-2 text-xs text-zinc-400">
                                {idea.twitterPost.length} chars
                                {idea.twitterPost.length > 280 && <span className="text-red-500 ml-1">(over limit!)</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && ideas.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Ready to Generate Ideas
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              Click the button above to analyze Checkit&apos;s existing content and generate fresh article ideas with social media posts.
            </p>
          </div>
        )}
      </div>

      {/* Article Modal */}
      {articleModal !== null && generatedArticles[articleModal] && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {generatedArticles[articleModal].title}
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {generatedArticles[articleModal].wordCount} words
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(generatedArticles[articleModal].article, 'article')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    copiedId === 'article'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {copiedId === 'article' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedId === 'article' ? 'Copied!' : 'Copy Article'}
                </button>
                <button
                  onClick={() => setArticleModal(null)}
                  className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <article className="prose prose-zinc dark:prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: generatedArticles[articleModal].article
                      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>')
                      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-6 mb-3">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                      .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc my-4">$&</ul>')
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                      .replace(/^(?!<)(.+)$/gm, '<p class="mb-4">$1</p>')
                  }} 
                />
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
