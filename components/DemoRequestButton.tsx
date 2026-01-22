'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import DemoRequestModal from '@/components/DemoRequestModal';

interface DemoRequestButtonProps {
  industry?: string;
  variant?: 'primary' | 'secondary';
  label?: string;
  className?: string;
}

export default function DemoRequestButton({ 
  industry, 
  variant = 'primary',
  label = 'Request a Demo',
  className = ''
}: DemoRequestButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const baseStyles = "inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all cursor-pointer";
  const variantStyles = variant === 'primary' 
    ? "btn-gradient text-white"
    : "bg-surface-elevated text-foreground hover:bg-surface";

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        {label}
        {variant === 'primary' && <ArrowRight className="w-4 h-4" />}
      </button>

      <DemoRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        industry={industry}
      />
    </>
  );
}
