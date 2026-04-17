'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';
import { login } from '@/lib/api/auth.api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || null;
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { showToast('Please fill in all fields', 'error'); return; }
    setLoading(true);
    try {
      const user = await login({ email, password });
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'owner') router.push(redirectTo || '/dashboard');
      else router.push(redirectTo || '/');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scaleIn">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div className="header__logo" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            <div className="header__logo-icon">🍽</div>
            Deal<span>Dish</span>
          </div>
        </div>
        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__subtitle">Sign in to access your deals and bookmarks</p>

        <form onSubmit={handleSubmit} suppressHydrationWarning>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input suppressHydrationWarning type="email" className="form-input" id="login-email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input suppressHydrationWarning type="password" className="form-input" id="login-password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button suppressHydrationWarning type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--primary-400)' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
