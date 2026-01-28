'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const DEPARTMENTS = [
  'Sales',
  'Customer Success',
  'Marketing',
  'Product',
  'Engineering',
  'Other',
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    accessCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill access code from URL
  useEffect(() => {
    if (codeFromUrl) {
      setFormData(prev => ({ ...prev, accessCode: codeFromUrl.toUpperCase() }));
    }
  }, [codeFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src="/checkit-logo-horizontal-standard-rgb-white.svg" 
              alt="Checkit" 
              className="h-8"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">Checkit GTM Hub</h1>
          <p className="text-muted">Register to access go-to-market tools and enablement</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 space-y-5 card-glow">
          {error && (
            <div className="rounded-lg px-4 py-3 text-sm text-error" style={{ background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(244, 63, 94, 0.05))', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:border-border-accent transition-all"
              placeholder="Sarah Chen"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Work Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:border-border-accent transition-all"
              placeholder="sarah@checkit.com"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium mb-2">
              Department
            </label>
            <select
              id="department"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:border-border-accent transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Select your department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Create Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:border-border-accent transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium mb-2">
              Access Code
              {codeFromUrl && (
                <span className="ml-2 text-xs text-success font-normal">Pre-filled from invite link</span>
              )}
            </label>
            <input
              id="accessCode"
              type="text"
              required
              value={formData.accessCode}
              onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
              className={`w-full bg-background border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:border-border-accent transition-all uppercase ${
                codeFromUrl ? 'border-success/50 bg-success/5' : 'border-border'
              }`}
              placeholder="Enter access code"
              readOnly={!!codeFromUrl}
            />
            {!codeFromUrl && (
              <p className="text-xs text-muted mt-1.5">Contact your manager for the access code</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gradient disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-3"
          >
            {loading ? 'Creating account...' : 'Get Started →'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-muted text-sm mt-6">
          Already registered?{' '}
          <Link href="/login" className="text-gradient font-medium hover:opacity-80 transition-opacity">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
