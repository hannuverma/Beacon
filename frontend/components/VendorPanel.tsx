
import React from 'react';
import { Vendor } from '../types';
import { Power, BarChart3, Plus, Settings, Users, Calendar, Store } from 'lucide-react';

interface VendorPanelProps {
  vendors: Vendor[];
  onToggleStatus: (id: string) => void;
}

const VendorPanel: React.FC<VendorPanelProps> = ({ vendors, onToggleStatus }) => {
  const myVendor = vendors[0];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="vendor-portal-header">
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <div className="flex items-center" style={{ gap: '0.75rem' }}>
            <div style={{ background: 'var(--purple)', width: '3rem', height: '3rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)' }}>
              <Store size={24} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Vendor Portal</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--purple)', margin: 0 }}>{myVendor.name}</p>
            </div>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <Settings size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center" style={{ padding: '1rem 0' }}>
          <button 
            onClick={() => onToggleStatus(myVendor.id)}
            className={`power-btn ${myVendor.isOpen ? 'on' : 'off'}`}
          >
            <Power size={40} style={{ marginBottom: '0.25rem' }} />
            <span style={{ fontSize: '0.625rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {myVendor.isOpen ? 'Live' : 'Offline'}
            </span>
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>
            {myVendor.isOpen ? 'Currently visible to NightOwls' : 'Tap to start your midnight shift'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Users size={20} color="var(--amber)" style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{myVendor.expectedPurchases}</p>
            <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Planned Visits</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <BarChart3 size={20} color="var(--blue)" style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>$452</p>
            <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Est. Earnings</p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Nearby Events</h3>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--purple)', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Plus size={12} style={{ marginRight: '0.25rem' }} /> Host New
            </button>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center' }}>
            <Calendar size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>No events scheduled tonight</p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Live Item Requests</h3>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderLeft: '3px solid var(--amber)', borderRadius: '0.5rem', padding: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>"Is there a vegan option for the ramen?"</p>
            <div className="flex justify-between items-center" style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>User #4812</span>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--amber)', fontSize: '0.625rem', fontWeight: 'bold', cursor: 'pointer' }}>Reply</button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', margin: 0 }}>Location verified: {myVendor.location.address}</p>
      </div>
    </div>
  );
};

export default VendorPanel;
