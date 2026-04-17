'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';
import { signup } from '@/lib/api/auth.api';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { showToast('Please fill in all fields', 'error'); return; }
    if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    setLoading(true);
    try {
      const user = await signup({
        name,
        email,
        password,
        role,
        ...(referralCode.trim() && { referralCode: referralCode.trim() }),
      });
      showToast(`Welcome aboard, ${user.name}!`, 'success');
      if (user.role === 'owner') router.push('/dashboard');
      else router.push('/');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Registration failed', 'error');
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
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Join DealDish to discover and save local deals</p>

        <form onSubmit={handleSubmit} suppressHydrationWarning>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input suppressHydrationWarning type="text" className="form-input" placeholder="Your name"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input suppressHydrationWarning type="email" className="form-input" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input suppressHydrationWarning type="password" className="form-input" placeholder="Min 6 characters"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">I am a</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {(['customer', 'owner'] as const).map(r => (
                <button
                  suppressHydrationWarning
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`btn btn--sm ${role === r ? 'btn--primary' : 'btn--ghost'}`}
                >
                  {r === 'customer' ? '🧑 Customer' : '🏪 Restaurant Owner'}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Referral Code <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <input suppressHydrationWarning type="text" className="form-input" placeholder="Enter referral code"
              value={referralCode} onChange={e => setReferralCode(e.target.value)} />
          </div>

          <button suppressHydrationWarning type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary-400)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
