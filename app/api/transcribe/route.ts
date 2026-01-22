import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/transcribe - Transcribe audio using OpenAI Whisper
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert File to the format OpenAI expects
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
    });

    // Clean up the transcription text
    let cleanedText = transcription.text.trim();
    
    // Basic cleanup - capitalize first letter, ensure proper ending
    if (cleanedText.length > 0) {
      cleanedText = cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
      if (!/[.!?]$/.test(cleanedText)) {
        cleanedText += '.';
      }
    }

    return NextResponse.json({ 
      text: cleanedText,
      rawText: transcription.text
    });
  } catch (error) {
    console.error('Transcription error:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to transcribe audio' }, 
      { status: 500 }
    );
  }
}
