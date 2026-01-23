'use client';

import { useState } from 'react';
import { Plus, Lightbulb } from 'lucide-react';
import ContributionModal from './ContributionModal';

type TargetType = 'positioning' | 'competitors' | 'content';

interface InlineAddButtonProps {
  targetType: TargetType;
  targetSection: string;
  sectionLabel: string;
  size?: 'sm' | 'md';
  variant?: 'icon' | 'text' | 'pill';
  className?: string;
}

export default function InlineAddButton({
  targetType,
  targetSection,
  sectionLabel,
  size = 'sm',
  variant = 'icon',
  className = ''
}: InlineAddButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4'
  };

  if (variant === 'pill') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors ${className}`}
          title={`Add insight for ${sectionLabel}`}
        >
          <Plus className="w-3 h-3" />
          Add Tip
        </button>
        <ContributionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          targetType={targetType}
          targetSection={targetSection}
          sectionLabel={sectionLabel}
        />
      </>
    );
  }

  if (variant === 'text') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors ${className}`}
          title={`Add insight for ${sectionLabel}`}
        >
          <Lightbulb className="w-3 h-3" />
          <span>Add insight</span>
        </button>
        <ContributionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          targetType={targetType}
          targetSection={targetSection}
          sectionLabel={sectionLabel}
        />
      </>
    );
  }

  // Default: icon variant
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`${sizeClasses[size]} flex items-center justify-center rounded-md bg-surface-elevated border border-border text-muted hover:text-accent hover:border-accent/50 hover:bg-accent/10 transition-all ${className}`}
        title={`Add insight for ${sectionLabel}`}
      >
        <Plus className={iconSizes[size]} />
      </button>
      <ContributionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        targetType={targetType}
        targetSection={targetSection}
        sectionLabel={sectionLabel}
      />
    </>
  );
}
