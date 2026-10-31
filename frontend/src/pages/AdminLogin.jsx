import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Email or password is incorrect.');
      }
    } catch {
      setError('Can’t reach the server. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-screen">
      <div className="panel login-card">
        <div>
          <h1 style={{ fontSize: 30 }}>Staff login</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Sign in to view and manage inquiries.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="field">
            <span>Email</span>
            <input className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>Password</span>
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {error && <p className="alert" role="alert">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="muted" style={{ fontSize: 14 }}>
          <Link to="/">Back to inquiry form</Link>
        </p>
      </div>
    </div>
  );
}