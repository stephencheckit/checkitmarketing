'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DEPARTMENTS = [
  'Sales',
  'Customer Success',
  'Marketing',
  'Product',
  'Engineering',
  'Other',
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    accessCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
            <div className="h-12 px-4 py-2 bg-accent rounded-xl flex items-center justify-center">
              <img 
                src="/checkit-logo-horizontal-standard-rgb-white.svg" 
                alt="Checkit" 
                className="h-6"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Checkit Marketing Hub</h1>
          <p className="text-muted">Register to access marketing tools and enablement</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 space-y-5">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error rounded-lg px-4 py-3 text-sm">
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
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:border-accent transition-colors"
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
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:border-accent transition-colors"
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
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:border-accent transition-colors appearance-none cursor-pointer"
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
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium mb-2">
              Access Code
            </label>
            <input
              id="accessCode"
              type="text"
              required
              value={formData.accessCode}
              onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:border-accent transition-colors uppercase"
              placeholder="Enter access code"
            />
            <p className="text-xs text-muted mt-1.5">Contact your manager for the access code</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-3 transition-colors"
          >
            {loading ? 'Creating account...' : 'Get Started →'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-muted text-sm mt-6">
          Already registered?{' '}
          <Link href="/login" className="text-accent hover:text-accent-hover transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
