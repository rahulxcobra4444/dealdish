'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ToastProvider';
import { adminApi } from '@/lib/api/admin.api';

type Tab = 'overview' | 'users' | 'restaurants' | 'offers' | 'broadcast' | 'rate-limits';

export default function AdminPage() {
  const router = useRouter();
  const { user, token } = useStore();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [users, setUsers] = useState<unknown[]>([]);
  const [pendingRestaurants, setPendingRestaurants] = useState<unknown[]>([]);
  const [rateLogs, setRateLogs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const [broadcastForm, setBroadcastForm] = useState({ subject: '', message: '' });
  const [broadcasting, setBroadcasting] = useState(false);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    if (user?.role !== 'admin') {
      showToast('Access denied. Admin only.', 'error');
      router.push('/');
    }
  }, [token, user, router, showToast]);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [sRes, uRes, rRes] = await Promise.all([
        adminApi.getStats(token),
        adminApi.getUsers(token),
        adminApi.getUnverifiedRestaurants(token),
      ]);
      setStats((sRes as { data: unknown }).data as Record<string, unknown>);
      setUsers((uRes as { data: { users: unknown[] } }).data.users);
      setPendingRestaurants((rRes as { data: { restaurants: unknown[] } }).data.restaurants);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    if (token && user?.role === 'admin') loadData();
  }, [token, user, loadData]);

  const loadRateLogs = useCallback(async () => {
    if (!token) return;
    try {
      const res = await adminApi.getRateLimits(token);
      setRateLogs((res as { data: { logs: unknown[] } }).data.logs);
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => {
    if (tab === 'rate-limits') loadRateLogs();
  }, [tab, loadRateLogs]);

  if (!token || user?.role !== 'admin') return null;

  const s = stats as { totalUsers?: number; totalRestaurants?: number; totalOffers?: number; totalReviews?: number } | null;

  const handleVerify = async (id: string) => {
    if (!token) return;
    try {
      await adminApi.verifyRestaurant(id, token);
      showToast('Restaurant verified!', 'success');
      await loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed', 'error');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!token || !confirm('Delete this user?')) return;
    try {
      await adminApi.deleteUser(id, token);
      showToast('User deleted', 'success');
      await loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed', 'error');
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setBroadcasting(true);
    try {
      await adminApi.broadcast(broadcastForm.subject, broadcastForm.message, token);
      showToast('Broadcast sent!', 'success');
      setBroadcastForm({ subject: '', message: '' });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to send', 'error');
    } finally {
      setBroadcasting(false);
    }
  };

  const handleUnban = async (id: string) => {
    if (!token) return;
    try {
      await adminApi.unbanIP(id, token);
      showToast('IP unbanned', 'success');
      await loadRateLogs();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed', 'error');
    }
  };

  const navItems: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'users', label: 'Users', icon: '👥' },
    { key: 'restaurants', label: 'Restaurants', icon: '🏪' },
    { key: 'broadcast', label: 'Broadcast Email', icon: '📧' },
    { key: 'rate-limits', label: 'Rate Limits', icon: '🔒' },
  ];

  return (
    <div style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', display: 'flex' }}>
      <aside className={`dashboard-sidebar${sidebarOpen ? ' dashboard-sidebar--open' : ''}`}>
        <div className="dashboard-sidebar__header">
          <div className="dashboard-sidebar__user">
            <div className="dashboard-sidebar__avatar" style={{ background: 'var(--accent-500)' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="dashboard-sidebar__name">{user.name}</div>
              <div className="dashboard-sidebar__role" style={{ color: 'var(--accent-400)' }}>Admin</div>
            </div>
          </div>
        </div>
        <nav className="dashboard-sidebar__nav">
          {navItems.map(item => (
            <button key={item.key}
              className={`dashboard-sidebar__nav-item${tab === item.key ? ' dashboard-sidebar__nav-item--active' : ''}`}
              onClick={() => { setTab(item.key); setSidebarOpen(false); }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className="dashboard-sidebar__footer">
          <button className="dashboard-sidebar__nav-item" onClick={() => router.push('/')}>← Back to Site</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <button className="dashboard-topbar__toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="dashboard-topbar__title">{navItems.find(n => n.key === tab)?.label}</h1>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading...</div>
          ) : (
            <>
              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div>
                  <div className="stats-grid">
                    <div className="stat-card"><div className="stat-card__value">{s?.totalUsers ?? 0}</div><div className="stat-card__label">Total Users</div></div>
                    <div className="stat-card"><div className="stat-card__value">{s?.totalRestaurants ?? 0}</div><div className="stat-card__label">Restaurants</div></div>
                    <div className="stat-card"><div className="stat-card__value">{s?.totalOffers ?? 0}</div><div className="stat-card__label">Total Offers</div></div>
                    <div className="stat-card"><div className="stat-card__value">{s?.totalReviews ?? 0}</div><div className="stat-card__label">Reviews</div></div>
                  </div>

                  {pendingRestaurants.length > 0 && (
                    <div style={{ marginTop: '32px' }}>
                      <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>⏳ Pending Verification ({pendingRestaurants.length})</h3>
                      <div className="table-wrapper">
                        <table className="data-table">
                          <thead><tr><th>Name</th><th>Owner</th><th>City</th><th>Action</th></tr></thead>
                          <tbody>
                            {(pendingRestaurants as Array<{ _id: string; name: string; owner: { name: string; email: string }; address: { city: string } }>).map(r => (
                              <tr key={r._id}>
                                <td>{r.name}</td>
                                <td>{r.owner?.name} <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>({r.owner?.email})</span></td>
                                <td>{r.address?.city}</td>
                                <td><button className="btn btn--primary btn--sm" onClick={() => handleVerify(r._id)}>Verify</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* USERS */}
              {tab === 'users' && (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
                    <tbody>
                      {(users as Array<{ _id: string; name: string; email: string; role: string; createdAt: string }>).map(u => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td><span className={`badge ${u.role === 'admin' ? 'badge--error' : u.role === 'owner' ? 'badge--warning' : 'badge--info'}`}>{u.role}</span></td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            {u.role !== 'admin' && (
                              <button className="btn btn--danger btn--sm" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RESTAURANTS (pending) */}
              {tab === 'restaurants' && (
                <div>
                  <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Pending Verification</h3>
                  {pendingRestaurants.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>All restaurants are verified ✅</p>
                  ) : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th>Name</th><th>Owner</th><th>City</th><th>Action</th></tr></thead>
                        <tbody>
                          {(pendingRestaurants as Array<{ _id: string; name: string; owner: { name: string }; address: { city: string } }>).map(r => (
                            <tr key={r._id}>
                              <td>{r.name}</td>
                              <td>{r.owner?.name}</td>
                              <td>{r.address?.city}</td>
                              <td><button className="btn btn--primary btn--sm" onClick={() => handleVerify(r._id)}>Verify</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* BROADCAST */}
              {tab === 'broadcast' && (
                <div className="dashboard-card">
                  <h2 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: 600 }}>📧 Broadcast Email to All Users</h2>
                  <form onSubmit={handleBroadcast}>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input className="form-input" value={broadcastForm.subject} onChange={e => setBroadcastForm(f => ({ ...f, subject: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea className="form-input" rows={6} value={broadcastForm.message} onChange={e => setBroadcastForm(f => ({ ...f, message: e.target.value }))} required style={{ resize: 'vertical' }} />
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={broadcasting}>
                      {broadcasting ? 'Sending...' : 'Send Broadcast'}
                    </button>
                  </form>
                </div>
              )}

              {/* RATE LIMITS */}
              {tab === 'rate-limits' && (
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead><tr><th>IP Address</th><th>Hit Count</th><th>Banned</th><th>Last Hit</th><th>Action</th></tr></thead>
                    <tbody>
                      {(rateLogs as Array<{ _id: string; ip: string; hitCount: number; isBanned: boolean; lastHit: string }>).map(log => (
                        <tr key={log._id}>
                          <td><code>{log.ip}</code></td>
                          <td>{log.hitCount}</td>
                          <td><span className={`badge ${log.isBanned ? 'badge--error' : 'badge--success'}`}>{log.isBanned ? 'Banned' : 'OK'}</span></td>
                          <td>{new Date(log.lastHit).toLocaleString()}</td>
                          <td>{log.isBanned && <button className="btn btn--primary btn--sm" onClick={() => handleUnban(log._id)}>Unban</button>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}