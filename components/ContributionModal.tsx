'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Lightbulb, AlertCircle, HelpCircle, PenLine, Eye, EyeOff, Mic, Square, Loader2 } from 'lucide-react';
import { useVoiceRecording, formatRecordingTime } from '@/lib/useVoiceRecording';
import { useToast } from './ToastProvider';

type TargetType = 'positioning' | 'competitors' | 'content';
type ContributionType = 'intel' | 'suggestion' | 'question' | 'correction';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: TargetType;
  targetSection?: string;
  sectionLabel?: string;
  onSuccess?: () => void;
}

const contributionTypes: { 
  value: ContributionType; 
  label: string; 
  description: string;
  icon: typeof Lightbulb;
  availableFor: TargetType[];
}[] = [
  { 
    value: 'intel', 
    label: 'I observed something', 
    description: 'Field intel, factual observation',
    icon: Eye,
    availableFor: ['competitors', 'positioning']
  },
  { 
    value: 'suggestion', 
    label: 'I have a suggestion', 
    description: 'Idea, improvement, recommendation',
    icon: Lightbulb,
    availableFor: ['positioning', 'competitors', 'content']
  },
  { 
    value: 'question', 
    label: 'I have a question', 
    description: 'Uncertainty, need clarification',
    icon: HelpCircle,
    availableFor: ['positioning', 'competitors', 'content']
  },
  { 
    value: 'correction', 
    label: 'This needs correction', 
    description: 'Something is wrong or outdated',
    icon: AlertCircle,
    availableFor: ['positioning', 'competitors']
  },
];

export default function ContributionModal({
  isOpen,
  onClose,
  targetType,
  targetSection,
  sectionLabel,
  onSuccess
}: ContributionModalProps) {
  const { toast } = useToast();
  
  const [contributionType, setContributionType] = useState<ContributionType | null>(null);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableTypes = contributionTypes.filter(t => t.availableFor.includes(targetType));

  // Use the shared voice recording hook
  const {
    isRecording,
    isTranscribing,
    recordingTime,
    micPermission,
    error: voiceError,
    startRecording,
    stopRecording,
    clearError: clearVoiceError
  } = useVoiceRecording({
    onTranscriptionComplete: (text) => {
      // Append transcribed text to content
      setContent(prev => {
        if (prev.trim()) {
          return prev + '\n\n' + text;
        }
        return text;
      });
    },
    onError: (err) => {
      setError(err);
    }
  });

  // Clear errors after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (voiceError) {
      const timer = setTimeout(clearVoiceError, 3000);
      return () => clearTimeout(timer);
    }
  }, [voiceError, clearVoiceError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributionType || !content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetSection,
          contributionType,
          content: content.trim(),
          isAnonymous
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit contribution');
      }

      // Show success toast
      toast({
        type: 'success',
        message: data.message || 'Your insight has been submitted!'
      });

      // Notify other components that a contribution was added
      window.dispatchEvent(new CustomEvent('contribution-updated'));

      // Reset and close
      resetForm();
      onClose();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      toast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to submit' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setContributionType(null);
    setContent('');
    setIsAnonymous(false);
    setError(null);
  };

  const handleClose = () => {
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }
    resetForm();
    onClose();
  };

  const targetLabels: Record<TargetType, string> = {
    positioning: 'Positioning',
    competitors: 'Competitors',
    content: 'Content'
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-surface-elevated border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface-elevated">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Add Contribution</h2>
              <p className="text-sm text-muted">
                {targetLabels[targetType]}
                {sectionLabel && <span className="text-accent"> &gt; {sectionLabel}</span>}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Contribution Type Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              What kind of insight?
            </label>
            <div className="space-y-2">
              {availableTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setContributionType(type.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                      contributionType === type.value
                        ? 'border-accent bg-accent/10 text-foreground'
                        : 'border-border bg-surface hover:border-muted text-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${contributionType === type.value ? 'text-accent' : ''}`} />
                    <div>
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs opacity-70">{type.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Recording Section */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500' : 'text-muted'}`} />
                <span className="text-sm font-medium text-foreground">Voice Recording</span>
              </div>
              {isRecording && (
                <span className="text-sm text-red-500 font-mono">{formatRecordingTime(recordingTime)}</span>
              )}
              {isTranscribing && (
                <span className="text-sm text-accent flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Transcribing...
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={!contributionType || isTranscribing || micPermission === 'denied'}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors animate-pulse cursor-pointer"
                >
                  <Square className="w-4 h-4" />
                  Stop Recording
                </button>
              )}
              
              <span className="text-xs text-muted">
                {micPermission === 'denied' 
                  ? 'Microphone access denied'
                  : isRecording 
                  ? 'Speaking... click Stop when done'
                  : 'Click to record your insight'}
              </span>
            </div>
            
            {isRecording && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 animate-pulse" style={{ width: '100%' }} />
                </div>
              </div>
            )}
          </div>

          {/* Content Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Your contribution {content && <span className="text-muted font-normal">({content.length} chars)</span>}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                contributionType === 'intel' 
                  ? "What did you observe? Type here or use voice recording above..."
                  : contributionType === 'correction'
                  ? "What's wrong and what should it be?"
                  : contributionType === 'question'
                  ? "What are you unsure about?"
                  : "Share your idea or suggestion... type or use voice recording"
              }
              rows={5}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
              disabled={!contributionType || isRecording}
            />
            <p className="text-xs text-muted mt-1">
              Type directly or use voice recording - transcription will be added here
            </p>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                isAnonymous
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface text-muted hover:text-foreground'
              }`}
            >
              {isAnonymous ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="text-sm">Anonymous</span>
                </>
              ) : (
                <>
                  <PenLine className="w-4 h-4" />
                  <span className="text-sm">Cite me if used</span>
                </>
              )}
            </button>
            <span className="text-xs text-muted">
              {isAnonymous 
                ? "Your name won't appear in citations" 
                : "Your name will appear if this insight is used"
              }
            </span>
          </div>

          {/* Auto-publish notice for competitor intel */}
          {targetType === 'competitors' && contributionType === 'intel' && (
            <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Eye className="w-4 h-4 text-green-500 mt-0.5" />
              <p className="text-sm text-green-400">
                Competitor intel is auto-published to keep battlecards current.
              </p>
            </div>
          )}

          {/* Error Message */}
          {(error || voiceError) && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error || voiceError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!contributionType || !content.trim() || isSubmitting || isRecording || isTranscribing}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );

  // Use portal to render outside of any stacking context
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return modalContent;
}
