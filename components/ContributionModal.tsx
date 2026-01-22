'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Lightbulb, AlertCircle, HelpCircle, PenLine, Eye, EyeOff, Mic, Square, Loader2 } from 'lucide-react';

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
  const [contributionType, setContributionType] = useState<ContributionType | null>(null);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const availableTypes = contributionTypes.filter(t => t.availableFor.includes(targetType));

  // Check microphone permission on mount
  useEffect(() => {
    if (isOpen && navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
        setMicPermission(result.state as 'granted' | 'denied' | 'prompt');
        result.onchange = () => {
          setMicPermission(result.state as 'granted' | 'denied' | 'prompt');
        };
      }).catch(() => {
        // Permissions API not supported, will check on first recording attempt
      });
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission('granted');
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        // Create audio blob and transcribe
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        
        if (audioBlob.size > 0) {
          await transcribeAudio(audioBlob);
        }
        
        setRecordingTime(0);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setMicPermission('denied');
        setError('Microphone access denied. Please enable it in your browser settings.');
      } else {
        setError('Could not access microphone. Please check your device.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      // Convert to a proper file with extension
      const extension = audioBlob.type.includes('webm') ? 'webm' : 'm4a';
      const audioFile = new File([audioBlob], `recording.${extension}`, { type: audioBlob.type });
      formData.append('audio', audioFile);
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Transcription failed');
      }
      
      // Append transcribed text to content
      setContent(prev => {
        if (prev.trim()) {
          return prev + '\n\n' + data.text;
        }
        return data.text;
      });
      
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

      setSuccess(data.message);
      setTimeout(() => {
        resetForm();
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setContributionType(null);
    setContent('');
    setIsAnonymous(false);
    setError(null);
    setSuccess(null);
    setIsRecording(false);
    setIsTranscribing(false);
    setRecordingTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleClose = () => {
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
              <h2 className="text-lg font-semibold text-foreground">Add Insight</h2>
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
                <span className="text-sm text-red-500 font-mono">{formatTime(recordingTime)}</span>
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
                  disabled={!contributionType || isTranscribing}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic className="w-4 h-4" />
                  Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors animate-pulse"
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
              Your insight {content && <span className="text-muted font-normal">({content.length} chars)</span>}
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
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!contributionType || !content.trim() || isSubmitting || isRecording || isTranscribing || !!success}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Insight'}
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
