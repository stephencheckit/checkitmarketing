'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClipboardCheck, Award, AlertTriangle, ChevronLeft, ChevronRight, RotateCcw, Home, Eye, EyeOff } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface QuizResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  results: Record<string, { correct: boolean; correctAnswer: number; explanation: string }>;
}

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await fetch('/api/quiz');
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Failed to load quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: String(answerIndex) });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setCurrentQuestion(0);
    setShowReview(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Result screen
  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`text-center p-6 rounded-xl border ${
          result.passed 
            ? 'bg-success/10 border-success/30' 
            : 'bg-warning/10 border-warning/30'
        }`}>
          {result.passed ? (
            <>
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <Award className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-success mb-2">Congratulations!</h1>
              <p className="text-muted mb-4">You&apos;re V6 Ready 🎉</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
              <h1 className="text-2xl font-bold text-warning mb-2">Almost There!</h1>
              <p className="text-muted mb-4">You need 80% to pass. Review and try again.</p>
            </>
          )}
          
          <div className="text-4xl font-bold mb-2">{result.score}%</div>
          <p className="text-sm text-muted mb-5">{result.correctCount} of {result.totalQuestions} correct</p>
          
          <div className="flex justify-center gap-3 flex-wrap">
            {!result.passed && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            )}
            <button
              onClick={() => setShowReview(!showReview)}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-accent/50 rounded-lg font-medium transition-colors"
            >
              {showReview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showReview ? 'Hide Review' : 'Review Answers'}
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-accent/50 rounded-lg font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>

        {/* Answer review */}
        {showReview && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Review Your Answers</h2>
            {questions.map((q, index) => {
              const questionResult = result.results[q.id];
              const userAnswer = parseInt(answers[q.id], 10);
              
              return (
                <div 
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    questionResult.correct 
                      ? 'bg-success/5 border-success/20' 
                      : 'bg-error/5 border-error/20'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      questionResult.correct ? 'bg-success text-white' : 'bg-error text-white'
                    }`}>
                      {questionResult.correct ? '✓' : '✗'}
                    </span>
                    <p className="font-medium">{index + 1}. {q.question}</p>
                  </div>
                  
                  <div className="ml-9 space-y-2">
                    {q.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        className={`text-sm p-2 rounded ${
                          optIndex === questionResult.correctAnswer
                            ? 'bg-success/20 text-success'
                            : optIndex === userAnswer && !questionResult.correct
                            ? 'bg-error/20 text-error line-through'
                            : 'text-muted'
                        }`}
                      >
                        {option}
                        {optIndex === questionResult.correctAnswer && ' ✓'}
                        {optIndex === userAnswer && optIndex !== questionResult.correctAnswer && ' (your answer)'}
                      </div>
                    ))}
                    
                    <p className="text-xs text-muted mt-2 italic">{questionResult.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canSubmit = answeredCount === questions.length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <ClipboardCheck className="w-7 h-7 text-accent" />
          V6 Certification Quiz
        </h1>
        <p className="text-sm text-muted mt-1">Answer all questions. You need 80% to pass.</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-muted">{answeredCount} answered</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      {question && (
        <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, index)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  answers[question.id] === String(index)
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[question.id] === String(index)
                      ? 'border-accent bg-accent'
                      : 'border-muted'
                  }`}>
                    {answers[question.id] === String(index) && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center gap-1 px-3 py-2 text-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex gap-1.5">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-7 h-7 rounded-full text-xs font-medium transition-all ${
                index === currentQuestion
                  ? 'bg-accent text-white'
                  : answers[questions[index]?.id]
                  ? 'bg-success/20 text-success'
                  : 'bg-surface text-muted hover:text-foreground'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="px-5 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
            className="flex items-center gap-1 px-3 py-2 text-accent hover:text-accent-hover transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
