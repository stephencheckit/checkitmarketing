'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useVoiceRecording, formatRecordingTime } from '@/lib/useVoiceRecording';

interface VoiceTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
  autoExpand?: boolean;
  minHeight?: number;
  prominentMic?: boolean;
}

function AudioWaveform({ stream }: { stream: MediaStream | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyserRef.current = analyser;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const barCount = 24;

    function draw() {
      if (!analyserRef.current || !ctx) return;
      animFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / barCount;
      const centerY = canvas.height / 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * dataArray.length);
        const value = dataArray[dataIndex] / 255;
        const barHeight = Math.max(3, value * centerY * 0.9);

        ctx.fillStyle = `rgba(239, 68, 68, ${0.4 + value * 0.6})`;
        ctx.beginPath();
        ctx.roundRect(
          i * barWidth + barWidth * 0.15,
          centerY - barHeight,
          barWidth * 0.7,
          barHeight * 2,
          2
        );
        ctx.fill();
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      analyserRef.current = null;
      source.disconnect();
      audioCtx.close();
    };
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={48}
      className="w-full max-w-[240px] h-12"
    />
  );
}

export default function VoiceTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  className = '',
  autoExpand = false,
  minHeight = 80,
  prominentMic = false,
}: VoiceTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const {
    isRecording,
    isTranscribing,
    recordingTime,
    micPermission,
    error,
    audioStream,
    startRecording,
    stopRecording,
    clearError
  } = useVoiceRecording({
    onTranscriptionComplete: (text) => {
      if (value.trim()) {
        onChange(value + '\n\n' + text);
      } else {
        onChange(text);
      }
    }
  });

  useEffect(() => {
    if (autoExpand && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(minHeight, textareaRef.current.scrollHeight)}px`;
    }
  }, [value, autoExpand, minHeight]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleMicClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, stopRecording, startRecording]);

  const showMicButton = !disabled && micPermission !== 'denied';

  if (prominentMic) {
    return (
      <div className={`${className}`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={autoExpand ? undefined : rows}
          disabled={disabled || isRecording}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 text-sm bg-surface-elevated border rounded-lg focus:outline-none focus:border-accent resize-none placeholder:text-muted/50 transition-colors ${
            isRecording
              ? 'border-red-500/50 bg-red-500/5'
              : isFocused
              ? 'border-accent'
              : 'border-border'
          } ${autoExpand ? 'overflow-hidden' : ''}`}
          style={autoExpand ? { minHeight: `${minHeight}px` } : undefined}
        />

        {showMicButton && (
          <div className="mt-3">
            {isRecording ? (
              <div className="flex items-center gap-4 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
                <button
                  type="button"
                  onClick={handleMicClick}
                  className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all cursor-pointer"
                >
                  <Square className="w-5 h-5" />
                </button>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <AudioWaveform stream={audioStream} />
                  <span className="text-sm font-mono text-red-400 shrink-0">
                    {formatRecordingTime(recordingTime)}
                  </span>
                </div>
              </div>
            ) : isTranscribing ? (
              <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-xl px-4 py-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/20">
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                </div>
                <span className="text-sm text-accent">Processing audio...</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleMicClick}
                className="flex items-center gap-3 w-full bg-surface hover:bg-surface-elevated border border-border hover:border-accent/30 rounded-xl px-4 py-3 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Mic className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground">Tap to record</span>
                  <span className="block text-xs text-muted">Share what you know about this account</span>
                </div>
              </button>
            )}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400 mt-2">{error}</p>
        )}
      </div>
    );
  }

  // Original compact layout
  return (
    <div className={`relative ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={autoExpand ? undefined : rows}
        disabled={disabled || isRecording}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 py-3 pr-12 text-sm bg-surface-elevated border rounded-lg focus:outline-none focus:border-accent resize-none placeholder:text-muted/50 transition-colors ${
          isRecording 
            ? 'border-red-500/50 bg-red-500/5' 
            : isFocused 
            ? 'border-accent' 
            : 'border-border'
        } ${autoExpand ? 'overflow-hidden' : ''}`}
        style={autoExpand ? { minHeight: `${minHeight}px` } : undefined}
      />

      {showMicButton && (
        <div className="absolute right-2 top-2">
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isTranscribing}
            className={`p-2 rounded-lg transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : isTranscribing
                ? 'bg-accent/20 text-accent'
                : 'bg-surface hover:bg-surface-elevated text-muted hover:text-foreground'
            }`}
            title={
              isRecording 
                ? 'Stop recording' 
                : isTranscribing 
                ? 'Transcribing...' 
                : 'Record voice input'
            }
          >
            {isTranscribing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <Square className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {isRecording && (
        <div className="absolute right-14 top-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-red-400">
            {formatRecordingTime(recordingTime)}
          </span>
        </div>
      )}

      {isTranscribing && (
        <div className="absolute right-14 top-3">
          <span className="text-xs text-accent">Transcribing...</span>
        </div>
      )}

      {error && (
        <div className="absolute left-0 right-0 -bottom-6">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
