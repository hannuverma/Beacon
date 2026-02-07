
import React, { useState } from 'react';
import { Vendor, Message, UserProfile } from '../types';
import { ChevronLeft, Star, ShoppingBag, Send, Sparkles, MessageCircle, Navigation } from 'lucide-react';
import { askGemini } from '../services/geminiService';

interface ShopDetailProps {
  vendor: Vendor;
  user: UserProfile;
  vendors: Vendor[];
  onBack: () => void;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ vendor, user, vendors, onBack }) => {
  const [query, setQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [showAI, setShowAI] = useState(false);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = { role: 'user', content: query };
    setChatHistory(prev => [...prev, userMessage]);
    setQuery('');
    setIsQuerying(true);

    const response = await askGemini(query, user, vendors);
    const aiMessage: Message = { role: 'assistant', content: response };
    setChatHistory(prev => [...prev, aiMessage]);
    setIsQuerying(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shop-hero">
        <img src={vendor.image} alt={vendor.name} className="hero-img" />
        <div className="hero-overlay"></div>
        <button onClick={onBack} className="back-btn">
          <ChevronLeft size={24} />
        </button>
        <div className="shop-info-overlay">
          <div style={{ background: 'var(--amber)', color: 'black', fontSize: '0.625rem', fontWeight: '900', padding: '0.15rem 0.5rem', borderRadius: '99px', marginBottom: '0.5rem', display: 'inline-block', textTransform: 'uppercase' }}>
            {vendor.isOpen ? 'Active Now' : 'Opening Soon'}
          </div>
          <h2 className="font-outfit" style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0, lineHeight: 1 }}>{vendor.name}</h2>
          <div className="flex" style={{ gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
            <span style={{ color: 'var(--amber)' }}>{vendor.category}</span>
            <div className="flex items-center" style={{ color: 'var(--text-secondary)' }}>
              <Star size={14} color="var(--amber)" fill="var(--amber)" style={{ marginRight: '0.25rem' }} />
              {vendor.rating}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '1.5rem' }}>
        <div className="flex items-center justify-between" style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center" style={{ gap: '0.75rem' }}>
            <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '0.5rem', borderRadius: '0.75rem' }}>
              <Navigation size={20} color="var(--amber)" />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, fontWeight: '500' }}>From Home</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>0.8 miles away</p>
            </div>
          </div>
          <button style={{ background: 'white', color: 'black', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}>
            Directions
          </button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>AI Assistant</h3>
            <button 
              onClick={() => setShowAI(!showAI)}
              style={{ background: showAI ? 'var(--amber)' : 'var(--bg-surface-lighter)', color: showAI ? 'black' : 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <MessageCircle size={14} />
              {showAI ? 'Close' : 'Ask Anything'}
            </button>
          </div>
          
          {showAI && (
            <div className="ai-assistant-card">
              <div className="chat-history no-scrollbar flex flex-col">
                {chatHistory.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <Sparkles size={40} style={{ color: 'rgba(251,191,36,0.1)', marginBottom: '1rem' }} />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0 2rem' }}>Ask me about locations or the menu. I use Google Maps grounding.</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                    {msg.content}
                  </div>
                ))}
                {isQuerying && (
                  <div className="flex" style={{ gap: '0.25rem', padding: '0.5rem' }}>
                    <div className="user-marker-glow" style={{ width: '6px', height: '6px', position: 'static' }}></div>
                    <div className="user-marker-glow" style={{ width: '6px', height: '6px', position: 'static', animationDelay: '0.2s' }}></div>
                    <div className="user-marker-glow" style={{ width: '6px', height: '6px', position: 'static', animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              <form onSubmit={handleQuery} style={{ padding: '0.75rem', background: 'black', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
                <input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Is it near Central Park?"
                  className="search-input"
                  style={{ borderRadius: '0.75rem', flex: 1 }}
                />
                <button type="submit" style={{ background: 'var(--amber)', border: 'none', padding: '0.6rem', borderRadius: '0.75rem', color: 'black', cursor: 'pointer' }}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>Midnight Menu</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {vendor.menu.map(item => (
              <div key={item.id} className="vendor-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <p style={{ fontWeight: 'bold', color: 'white', margin: 0 }}>{item.name}</p>
                  <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>{item.description}</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: '900', color: 'var(--amber)', margin: '0.5rem 0 0 0' }}>${item.price.toFixed(2)}</p>
                </div>
                <button className="sidebar-btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)' }}>
                  <ShoppingBag size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '1.5rem', background: 'black', borderTop: '1px solid var(--border)' }}>
        <button className="auth-submit" style={{ padding: '1.25rem', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
          Confirm Visit
        </button>
      </div>
    </div>
  );
};

export default ShopDetail;
