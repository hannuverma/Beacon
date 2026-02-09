
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { User, Store, Mail, Lock, MapPin, ArrowRight } from 'lucide-react';

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('1');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'https://beacon-api-pzaa.onrender.com';

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
          host_profile_id: data.host_profile_id,
          homeLocation: {
            lat: data.home_location?.lat || 0,
            lng: data.home_location?.lng || 0,
            address: data.home_location?.address || '',
          },
        };
        onAuthComplete(profile);
      } else {
        // Signup flow
        const endpoint = role === 'HOST' ? 'signup/host/' : 'signup/user/';
        const payload = role === 'HOST'
          ? {
              name,
              email,
              password,
              address,
              phone_number: phoneNumber || undefined,
              bio: bio || undefined,
              category: category || undefined,
              latitude: latitude ? parseFloat(latitude) : undefined,
              longitude: longitude ? parseFloat(longitude) : undefined,
            }
          : { name, email, password, address };
        
        const res = await fetch(`${API_BASE}/api/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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
          host_profile_id: data.host_profile_id,
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
          <div style={{ 
            marginBottom: '1rem', 
            padding: '1rem', 
            borderRadius: '1.5rem',
            background: 'linear-gradient(135deg, #ffa60000 0%, #ffeb3b00 50%, #00000000 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src="https://beacon-api-pzaa.onrender.com/static/icon/logo2.png" alt="Beacon" style={{ width: '130px', height: '130px', objectFit: 'contain' }} />
          </div>
          <h1 className="font-outfit" style={{ fontSize: '2rem', margin: 0 }}>Beacon</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Real-time midnight host finder</p>
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
                onClick={() => setRole('HOST')}
                className={`role-btn ${role === 'HOST' ? 'active host' : ''}`}
              >
                <Store size={20} />
                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '0.25rem' }}>host</span>
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

          {!isLogin && role === 'HOST' && (
            <>
              <div className="auth-input-group">
                <Mail className="auth-icon" size={18} />
                <input 
                  type="tel" 
                  placeholder="Phone Number (Optional)" 
                  className="auth-input"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="auth-input-group">
                <User className="auth-icon" size={18} />
                <textarea 
                  placeholder="Business Bio (Optional)"
                  className="auth-input"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={2}
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div className="auth-input-group">
                <Store className="auth-icon" size={18} />
                <select 
                  className="auth-input"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="1">Musical</option>
                  <option value="2">Dance</option>
                  <option value="3">Art</option>
                  <option value="4">Shop</option>
                  <option value="5">Service</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="auth-input-group">
                  <MapPin className="auth-icon" size={18} />
                  <input 
                    type="number" 
                    placeholder="Latitude (Optional)"
                    className="auth-input"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    step="0.0001"
                  />
                </div>
                <div className="auth-input-group">
                  <MapPin className="auth-icon" size={18} />
                  <input 
                    type="number" 
                    placeholder="Longitude (Optional)"
                    className="auth-input"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    step="0.0001"
                  />
                </div>
              </div>
            </>
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
