
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
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || (isLogin ? 'Midnight Rider' : 'New Vendor'),
      role,
      homeLocation: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.01,
        lng: -74.0060 + (Math.random() - 0.5) * 0.01,
        address: address || '123 Neon Way'
      }
    };
    onAuthComplete(mockUser);
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

          <button type="submit" className="auth-submit">
            <span>{isLogin ? 'Enter the Night' : 'Create Account'}</span>
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
