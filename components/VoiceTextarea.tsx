'use client';

import { useRef, useEffect, useState } from 'react';
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
}

export default function VoiceTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  className = '',
  autoExpand = false,
  minHeight = 80
}: VoiceTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const {
    isRecording,
    isTranscribing,
    recordingTime,
    micPermission,
    error,
    startRecording,
    stopRecording,
    clearError
  } = useVoiceRecording({
    onTranscriptionComplete: (text) => {
      // Append transcribed text to existing content
      if (value.trim()) {
        onChange(value + '\n\n' + text);
      } else {
        onChange(text);
      }
    }
  });

  // Auto-expand textarea
  useEffect(() => {
    if (autoExpand && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(minHeight, textareaRef.current.scrollHeight)}px`;
    }
  }, [value, autoExpand, minHeight]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const showMicButton = !disabled && micPermission !== 'denied';

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

      {/* Voice Recording Button */}
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

      {/* Recording Timer */}
      {isRecording && (
        <div className="absolute right-14 top-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-red-400">
            {formatRecordingTime(recordingTime)}
          </span>
        </div>
      )}

      {/* Transcribing Status */}
      {isTranscribing && (
        <div className="absolute right-14 top-3">
          <span className="text-xs text-accent">Transcribing...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute left-0 right-0 -bottom-6">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
