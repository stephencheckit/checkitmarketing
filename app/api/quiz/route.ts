import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { saveQuizAttempt, getUserQuizAttempts } from '@/lib/db';
import { QUIZ_QUESTIONS, PASSING_SCORE } from '@/lib/modules';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const attempts = await getUserQuizAttempts(session.userId);
    return NextResponse.json({ 
      attempts,
      questions: QUIZ_QUESTIONS.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to get quiz data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { answers } = await request.json();

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Answers are required' },
        { status: 400 }
      );
    }

    // Calculate score
    let correctCount = 0;
    const results: Record<string, { correct: boolean; correctAnswer: number; explanation: string }> = {};

    for (const question of QUIZ_QUESTIONS) {
      const userAnswer = parseInt(answers[question.id], 10);
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctCount++;
      }

      results[question.id] = {
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    }

    const score = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    const passed = score >= PASSING_SCORE;

    // Save attempt
    const attempt = await saveQuizAttempt(
      session.userId,
      score,
      QUIZ_QUESTIONS.length,
      passed,
      answers
    );

    return NextResponse.json({
      success: true,
      score,
      passed,
      correctCount,
      totalQuestions: QUIZ_QUESTIONS.length,
      results,
      attempt,
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
