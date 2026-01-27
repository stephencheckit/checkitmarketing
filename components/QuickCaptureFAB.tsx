'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Mic, Square, Loader2, X, Send, ChevronDown, GripVertical } from 'lucide-react';
import { useVoiceRecording, formatRecordingTime } from '@/lib/useVoiceRecording';
import { useToast } from './ToastProvider';

type TargetType = 'positioning' | 'competitors' | 'content';

interface RouteMapping {
  targetType: TargetType;
  targetSection: string;
  label: string;
}

interface Position {
  x: number;
  y: number;
}

// Map routes to contribution targets
const routeMappings: Record<string, RouteMapping> = {
  '/positioning': { targetType: 'positioning', targetSection: 'General', label: 'Positioning' },
  '/competitors': { targetType: 'competitors', targetSection: 'General', label: 'Competitors' },
  '/content': { targetType: 'content', targetSection: 'General', label: 'Content' },
  '/discovery': { targetType: 'positioning', targetSection: 'Discovery', label: 'Discovery' },
  '/solutioning': { targetType: 'positioning', targetSection: 'Solutioning', label: 'Solutioning' },
  '/closing': { targetType: 'positioning', targetSection: 'Closing', label: 'Closing' },
  '/reference': { targetType: 'positioning', targetSection: 'Reference', label: 'Reference' },
  '/learn': { targetType: 'positioning', targetSection: 'Training', label: 'Training' },
  '/dashboard': { targetType: 'positioning', targetSection: 'General', label: 'General' },
  '/ovg-analytics': { targetType: 'positioning', targetSection: 'Accounts', label: 'OVG Accounts' },
  '/tools': { targetType: 'positioning', targetSection: 'Tools', label: 'Tools' },
};

const defaultMapping: RouteMapping = {
  targetType: 'positioning',
  targetSection: 'General',
  label: 'General'
};

const STORAGE_KEY = 'quickCaptureFABPosition_v4'; // Bumped version to reset all positions

type FABState = 'idle' | 'recording' | 'transcribing' | 'preview' | 'submitting';

export default function QuickCaptureFAB() {
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [state, setState] = useState<FABState>('idle');
  const [transcribedText, setTranscribedText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<RouteMapping | null>(null);
  const [showTargetSelect, setShowTargetSelect] = useState(false);
  
  // Drag state - using x,y from top-left
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);

  // Initialize position after mount
  useEffect(() => {
    setMounted(true);
    
    // Load position from localStorage or calculate default (bottom-right)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          setPosition(parsed);
          return;
        }
      } catch {
        // Invalid JSON, use default
      }
    }
    
    // Default position: bottom-right corner
    setPosition({
      x: window.innerWidth - 120, // 120px from right edge
      y: window.innerHeight - 80  // 80px from bottom edge
    });
  }, []);

  // Save position to localStorage when drag ends
  useEffect(() => {
    if (mounted && !isDragging && position) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    }
  }, [position, isDragging, mounted]);

  // Handle drag start
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (!position) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      startX: position.x,
      startY: position.y
    };
  }, [position]);

  // Handle drag move
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = clientX - dragStartRef.current.mouseX;
    const deltaY = clientY - dragStartRef.current.mouseY;

    let newX = dragStartRef.current.startX + deltaX;
    let newY = dragStartRef.current.startY + deltaY;

    // Constrain to viewport
    const fabWidth = 100;
    const fabHeight = 56;
    
    newX = Math.max(0, Math.min(newX, window.innerWidth - fabWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - fabHeight));

    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  // Global mouse/touch move and up handlers
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    };

    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Get route mapping based on current path
  const getRouteMapping = (): RouteMapping => {
    if (routeMappings[pathname]) {
      return routeMappings[pathname];
    }
    const basePath = '/' + pathname.split('/')[1];
    if (routeMappings[basePath]) {
      return routeMappings[basePath];
    }
    return defaultMapping;
  };

  const currentMapping = selectedTarget || getRouteMapping();

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
      setTranscribedText(text);
      setState('preview');
      setIsExpanded(true);
    },
    onError: (err) => {
      toast({ type: 'error', message: err });
      setState('idle');
    }
  });

  // Sync recording state
  useEffect(() => {
    if (isRecording) {
      setState('recording');
    } else if (isTranscribing) {
      setState('transcribing');
    }
  }, [isRecording, isTranscribing]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleFABClick = async () => {
    if (isDragging) return;
    if (state === 'idle') {
      await startRecording();
    } else if (state === 'recording') {
      stopRecording();
    }
  };

  const handleSubmit = async () => {
    if (!transcribedText.trim()) return;

    setState('submitting');
    
    try {
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: currentMapping.targetType,
          targetSection: currentMapping.targetSection,
          contributionType: 'intel',
          content: transcribedText.trim(),
          isAnonymous: false
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      toast({ 
        type: 'success', 
        message: data.message || 'Your insight has been captured!'
      });

      // Notify other components that a contribution was added
      window.dispatchEvent(new CustomEvent('contribution-updated'));

      setTranscribedText('');
      setIsExpanded(false);
      setState('idle');
      setSelectedTarget(null);
    } catch (err) {
      toast({ 
        type: 'error', 
        message: err instanceof Error ? err.message : 'Failed to submit'
      });
      setState('preview');
    }
  };

  const handleCancel = () => {
    setTranscribedText('');
    setIsExpanded(false);
    setState('idle');
    setSelectedTarget(null);
    setShowTargetSelect(false);
  };

  // Don't render on auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return null;
  }

  // Only render after mount to avoid hydration mismatch
  if (!mounted || !position) {
    return null;
  }

  // Panel position (above the FAB)
  const panelY = position.y - 320; // Panel is ~300px tall + gap

  const fabContent = (
    <>
      {/* Expanded Preview Panel */}
      {isExpanded && (state === 'preview' || state === 'submitting') && (
        <div 
          className="fixed z-[9997] bg-surface-elevated border border-border rounded-xl shadow-2xl w-80 overflow-hidden animate-slide-in"
          style={{
            left: position.x - 220, // Align right edge with FAB
            top: Math.max(10, panelY),
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">Quick Capture</span>
            <button
              onClick={handleCancel}
              className="p-1 text-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Target Selector */}
          <div className="px-4 py-2 border-b border-border/50">
            <button
              onClick={() => setShowTargetSelect(!showTargetSelect)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Saving to:</span>
                <span className="text-sm font-medium text-accent">
                  {currentMapping.label}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted transition-transform ${showTargetSelect ? 'rotate-180' : ''}`} />
            </button>
            
            {showTargetSelect && (
              <div className="mt-2 space-y-1">
                {Object.entries(routeMappings).map(([path, mapping]) => (
                  <button
                    key={path}
                    onClick={() => {
                      setSelectedTarget(mapping);
                      setShowTargetSelect(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                      currentMapping.label === mapping.label
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    {mapping.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <textarea
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              placeholder="Your captured insight..."
              rows={4}
              className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent resize-none placeholder:text-muted/50"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 px-4 pb-4">
            <button
              onClick={handleCancel}
              className="px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!transcribedText.trim() || state === 'submitting'}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Recording Timer */}
      {state === 'recording' && (
        <div 
          className="fixed z-[9997] bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2 flex items-center gap-3 animate-slide-in"
          style={{
            left: position.x - 100,
            top: position.y - 50,
          }}
        >
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-mono text-red-400">
            {formatRecordingTime(recordingTime)}
          </span>
          <span className="text-xs text-red-400">Recording...</span>
        </div>
      )}

      {/* Transcribing Status */}
      {state === 'transcribing' && (
        <div 
          className="fixed z-[9997] bg-accent/20 border border-accent/30 rounded-lg px-4 py-2 flex items-center gap-3 animate-slide-in"
          style={{
            left: position.x - 80,
            top: position.y - 50,
          }}
        >
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
          <span className="text-sm text-accent">Transcribing...</span>
        </div>
      )}

      {/* FAB Widget */}
      <div 
        className="fixed z-[9998] flex items-center gap-1 bg-surface-elevated border border-border rounded-full shadow-lg h-14"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {/* Drag Handle */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`p-3 cursor-grab active:cursor-grabbing text-muted hover:text-foreground transition-colors select-none ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
          title="Drag to move"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Mic Button */}
        <button
          onClick={handleFABClick}
          disabled={state === 'transcribing' || state === 'submitting' || micPermission === 'denied'}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all mr-1 ${
            state === 'recording'
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : state === 'transcribing'
              ? 'bg-accent/50 cursor-wait'
              : micPermission === 'denied'
              ? 'bg-surface cursor-not-allowed'
              : 'bg-accent hover:bg-accent/90 hover:scale-105'
          }`}
          title={
            micPermission === 'denied'
              ? 'Microphone access denied'
              : state === 'recording'
              ? 'Stop recording'
              : state === 'transcribing'
              ? 'Transcribing...'
              : 'Start quick voice capture'
          }
        >
          {state === 'recording' ? (
            <Square className="w-5 h-5 text-white" />
          ) : state === 'transcribing' ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Mic className={`w-5 h-5 ${micPermission === 'denied' ? 'text-muted' : 'text-white'}`} />
          )}
        </button>
      </div>
    </>
  );

  return createPortal(fabContent, document.body);
}
