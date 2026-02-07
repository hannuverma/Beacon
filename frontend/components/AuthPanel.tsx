
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { Moon, User, Store, Mail, Lock, MapPin, ArrowRight } from 'lucide-react';

interface AuthPanelProps {
  onAuthComplete: (user: UserProfile) => void;
}

const AuthPanel: React.FC<AuthPanelProps> = ({ onAuthComplete }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'http://127.0.0.1:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login flow
        const res = await fetch(`${API_BASE}/api/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.detail || 'Login failed');
          setLoading(false);
          return;
        }
        const profile: UserProfile = {
          id: String(data.id),
          email: data.email,
          name: data.name,
          role: data.role,
          homeLocation: {
            lat: data.home_location?.lat || 0,
            lng: data.home_location?.lng || 0,
            address: data.home_location?.address || '',
          },
        };
        onAuthComplete(profile);
      } else {
        // Signup flow
        const endpoint = role === 'VENDOR' ? 'signup/host/' : 'signup/user/';
        const res = await fetch(`${API_BASE}/api/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, address }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.detail || 'Signup failed');
          setLoading(false);
          return;
        }
        const profile: UserProfile = {
          id: String(data.id),
          email: data.email,
          name: data.name,
          role: data.role,
          homeLocation: {
            lat: data.home_location?.lat || data.business_location?.lat || 0,
            lng: data.home_location?.lng || data.business_location?.lng || 0,
            address: data.home_location?.address || data.business_location?.address || '',
          },
        };
        onAuthComplete(profile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-glow-1"></div>
      <div className="auth-glow-2"></div>

      <div className="auth-card">
        <div className="flex flex-col items-center" style={{ marginBottom: '2rem' }}>
          <div className="sidebar-btn active user" style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '1.5rem' }}>
            <Moon size={32} />
          </div>
          <h1 className="font-outfit" style={{ fontSize: '2rem', margin: 0 }}>NightOwl</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Real-time midnight vendor finder</p>
        </div>

        <div className="auth-tabs">
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            className={`auth-tab ${isLogin ? 'active' : ''}`}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-role-btns">
              <button 
                type="button"
                onClick={() => setRole('USER')}
                className={`role-btn ${role === 'USER' ? 'active user' : ''}`}
              >
                <User size={20} />
                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '0.25rem' }}>Customer</span>
              </button>
              <button 
                type="button"
                onClick={() => setRole('VENDOR')}
                className={`role-btn ${role === 'VENDOR' ? 'active vendor' : ''}`}
              >
                <Store size={20} />
                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '0.25rem' }}>Vendor</span>
              </button>
            </div>
          )}

          {!isLogin && (
            <div className="auth-input-group">
              <User className="auth-icon" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                className="auth-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-input-group">
            <Mail className="auth-icon" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <Lock className="auth-icon" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              className="auth-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="auth-input-group">
              <MapPin className="auth-icon" size={18} />
              <input 
                type="text" 
                placeholder={role === 'USER' ? "Home Address" : "Business Address"}
                className="auth-input"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <div style={{ 
              marginBottom: '1rem', 
              padding: '0.75rem', 
              borderRadius: '0.75rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            <span>{loading ? 'Loading...' : (isLogin ? 'Enter the Night' : 'Create Account')}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          By continuing, you agree to our Terms of Night.
        </p>
      </div>
    </div>
  );
};

export default AuthPanel;
