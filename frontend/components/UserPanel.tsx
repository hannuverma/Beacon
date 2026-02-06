
import React, { useState } from 'react';
import { Vendor, UserProfile } from '../types';
import { Search, Star, ShoppingBag, MapPin, Sparkles } from 'lucide-react';
import ShopDetail from './ShopDetail';

interface UserPanelProps {
  user: UserProfile;
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  onCloseVendor: () => void;
  onSelectVendor: (id: string) => void;
}

const UserPanel: React.FC<UserPanelProps> = ({ user, vendors, selectedVendor, onCloseVendor, onSelectVendor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(vendors.map(v => v.category)));

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedVendor) {
    return <ShopDetail vendor={selectedVendor} user={user} vendors={vendors} onBack={onCloseVendor} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="user-panel-header">
        <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
          <h2 className="font-outfit" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Night Hunt</h2>
          <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '99px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'var(--amber)', textTransform: 'uppercase' }}>NYC Midnight</span>
          </div>
        </div>
        
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
          Near {user.homeLocation?.address}
        </p>

        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="What are you craving?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-scroll no-scrollbar">
          <button 
            onClick={() => setActiveCategory(null)}
            className={`cat-chip ${!activeCategory ? 'active' : ''}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="vendor-list no-scrollbar">
        {filteredVendors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <MapPin size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>No vendors found here.</p>
          </div>
        ) : (
          filteredVendors.map(vendor => (
            <div 
              key={vendor.id}
              onClick={() => onSelectVendor(vendor.id)}
              className="vendor-card"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{vendor.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>{vendor.category}</p>
                </div>
                <div className={`status-badge ${vendor.isOpen ? 'live' : 'closed'}`}>
                  {vendor.isOpen ? 'Live Now' : 'Closed'}
                </div>
              </div>
              <div className="flex" style={{ gap: '1rem', fontSize: '0.625rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                <div className="flex items-center">
                  <Star size={12} color="var(--amber)" fill="var(--amber)" style={{ marginRight: '0.25rem' }} />
                  {vendor.rating}
                </div>
                <div className="flex items-center">
                  <ShoppingBag size={12} style={{ marginRight: '0.25rem' }} />
                  {vendor.expectedPurchases} visits
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'rgba(23, 23, 23, 0.8)' }}>
        <button className="auth-submit" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          <Sparkles size={18} />
          <span>Plan My Route</span>
        </button>
      </div>
    </div>
  );
};

export default UserPanel;
