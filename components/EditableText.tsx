'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';

interface EditableTextProps {
  pageId: string;
  fieldId: string;
  defaultValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
}

interface AuthResponse {
  user?: {
    role?: string;
  };
  error?: string;
}

export default function EditableText({
  pageId,
  fieldId,
  defaultValue,
  as: Component = 'span',
  className = '',
  multiline = false,
}: EditableTextProps) {
  const [content, setContent] = useState(defaultValue);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(defaultValue);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if user is admin
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data: AuthResponse | null) => {
        if (data?.user?.role === 'admin') {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  // Load content from database
  useEffect(() => {
    fetch(`/api/page-content?pageId=${encodeURIComponent(pageId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.content && data.content[fieldId]) {
          setContent(data.content[fieldId]);
          setEditValue(data.content[fieldId]);
        }
        setIsLoaded(true);
      })
      .catch(() => {
        setIsLoaded(true);
      });
  }, [pageId, fieldId]);

  // Auto-resize textarea and focus when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.focus();
      textarea.select();
      // Auto-resize to fit content
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [isEditing]);

  // Auto-resize on content change
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSave = useCallback(async () => {
    if (editValue === content) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/page-content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, fieldId, content: editValue }),
      });

      if (res.ok) {
        setContent(editValue);
        setIsEditing(false);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      } else {
        // Revert on error
        setEditValue(content);
      }
    } catch {
      setEditValue(content);
    }
    setIsSaving(false);
  }, [editValue, content, pageId, fieldId]);

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd/Ctrl+Enter to save (works for both single and multiline)
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
      return;
    }
    // Regular Enter for single-line
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Non-admin view: just render the content
  if (!isAdmin) {
    return <Component className={className}>{content}</Component>;
  }

  // Admin editing mode
  if (isEditing) {
    return (
      <span className="inline-block w-full relative" style={{ textAlign: 'inherit' }}>
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isSaving}
          className="w-full bg-white text-gray-900 border-2 border-blue-500 rounded-lg px-3 py-2 outline-none shadow-lg resize-none overflow-hidden"
          style={{
            fontSize: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
            fontFamily: 'inherit',
            textAlign: 'inherit',
          }}
        />
        {/* Floating action buttons */}
        <span className="absolute -bottom-10 right-0 flex items-center gap-2 bg-white rounded-lg shadow-lg px-2 py-1.5 border border-gray-200 z-10">
          {isSaving ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-medium"
                title="Save (Cmd+Enter)"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm font-medium"
                title="Cancel (Esc)"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </span>
      </span>
    );
  }

  // Admin view: clickable with edit indicator
  return (
    <span className="group relative inline">
      <Component
        className={`${className} cursor-pointer hover:bg-blue-100/50 hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-dashed rounded-sm transition-all`}
        onClick={() => setIsEditing(true)}
        title="Click to edit"
      >
        {content}
      </Component>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md"
        title="Edit"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      {showSaved && (
        <span className="absolute -right-20 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full shadow-sm">
          Saved!
        </span>
      )}
    </span>
  );
}
