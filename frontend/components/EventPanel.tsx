import React, { useState, useEffect } from 'react';
import { Events, UserProfile } from '../types';
import { Power, BarChart3, Plus, Users, Calendar, Store, X, MapPin } from 'lucide-react';
import axios from 'axios';

interface EventPanelProps {
  events: Events[];
  user: UserProfile | null;
  selectedEventId?: number | null;
  draftLocation?: { lat: number; lng: number } | null;
  onSetDraftLocation?: (location: { lat: number; lng: number } | null) => void;
  onToggleStatus: (id: string | number) => void;
  onCreateEvent: () => void;
  onSelectEvent?: (id: number | null) => void;
  onEventCreated?: () => void;
}

const API_BASE = 'http://127.0.0.1:8000';

const EventPanel: React.FC<EventPanelProps> = ({ events, user, selectedEventId, draftLocation, onSetDraftLocation, onToggleStatus, onCreateEvent, onSelectEvent, onEventCreated }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '1',
    eventDate: '',
    bookingLink: '',
    address: '',
    image: null as File | null,
  });

  // Filter to only show events belonging to this host
  const hostEvents = events.filter(e => e.host === user?.host_profile_id);
  const myEvent = selectedEventId ? hostEvents.find(e => e.id === selectedEventId) : hostEvents[0];

  // Reverse geocode map location to get address
  useEffect(() => {
    if (draftLocation && draftLocation.lat && draftLocation.lng) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${draftLocation.lat}&lon=${draftLocation.lng}`)
        .then(r => r.json())
        .then(data => {
          // Build address from available components
          const addr = data.address;
          const addressParts = [
            addr.road || addr.street,
            addr.hamlet || addr.village || addr.town || addr.city,
            addr.county,
            addr.state,
          ].filter(Boolean);
          const fullAddress = addressParts.join(', ');
          setFormData(prev => ({ ...prev, address: fullAddress }));
        })
        .catch(err => console.error('Geocoding failed:', err));
    }
  }, [draftLocation]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement & { files?: FileList };
    if (target.type === 'file' && target.files) {
      setFormData(prev => ({
        ...prev,
        image: target.files![0] || null
      }));
    } else {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Validate required fields
    if (!formData.title.trim()) {
      setSubmitError('Event title is required');
      return;
    }
    if (!formData.description.trim()) {
      setSubmitError('Event description is required');
      return;
    }
    if (!formData.eventDate) {
      setSubmitError('Event date and time is required');
      return;
    }
    if (!formData.bookingLink.trim()) {
      setSubmitError('Booking link is required');
      return;
    }
    if (!draftLocation) {
      setSubmitError('Please click on the map to select event location');
      return;
    }
    if (!user?.host_profile_id) {
      setSubmitError('User not properly authenticated as a host');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Parse the datetime-local value
      const eventDate = new Date(formData.eventDate);
      
      // Use FormData for multipart upload (for image)
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('event_date', eventDate.toISOString());
      payload.append('booking_link', formData.bookingLink);
      payload.append('listing_type', 'event');
      payload.append('latitude', draftLocation.lat.toString());
      payload.append('longitude', draftLocation.lng.toString());
      payload.append('address', formData.address);
      payload.append('host', user.host_profile_id.toString());
      
      if (formData.image) {
        payload.append('image', formData.image);
      }

      console.log('Sending payload with location:', { lat: draftLocation.lat, lng: draftLocation.lng });

      const response = await axios.post(`${API_BASE}/api/listings/`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('Event created:', response.data);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '1',
        eventDate: '',
        bookingLink: '',
        address: '',
        image: null,
      });
      setShowCreateForm(false);
      
      // Clear draft location on map
      if (onSetDraftLocation) {
        onSetDraftLocation(null);
      }
      
      // Notify parent to refresh events
      if (onEventCreated) {
        onEventCreated();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        let errorMsg = 'Failed to create event';
        
        // Handle validation errors
        if (typeof errorData === 'object' && errorData !== null) {
          const errors = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          errorMsg = errors || error.message;
        } else if (errorData?.detail) {
          errorMsg = errorData.detail;
        } else {
          errorMsg = error.message;
        }
        
        setSubmitError(errorMsg);
      } else {
        setSubmitError('Failed to create event. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!myEvent) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>
          You haven’t hosted any events yet.
        </p>

        <button
          onClick={onCreateEvent}
          style={{
            marginTop: '1rem',
            background: 'var(--purple)',
            color: 'white',
            padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={16} />
          Create your first event
        </button>
      </div>
    );
  }

  return (  
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Section */}
      <div className="vendor-portal-header">
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <div className="flex items-center" style={{ gap: '0.75rem' }}>
            <div style={{ background: 'var(--purple)', width: '3rem', height: '3rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)' }}>
              <Store size={24} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Event Portal</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--purple)', margin: 0 }}>{myEvent.title}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--purple)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <Plus size={12} style={{ marginRight: '0.25rem' }} />
            Host New
          </button>
        </div>

        {/* Live Status Toggle */}
        <div className="flex flex-col items-center justify-center" style={{ padding: '1rem 0' }}>
          <button 
            onClick={() => onToggleStatus(myEvent.id)}
            className={`power-btn ${myEvent.isActive ? 'on' : 'off'}`}
          >
            <Power size={40} style={{ marginBottom: '0.25rem' }} />
            <span style={{ fontSize: '0.625rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {myEvent.isActive ? 'Live' : 'Offline'}
            </span>
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>
            {myEvent.isActive ? 'Currently visible to NightOwls' : 'Tap to start your midnight shift'}
          </p>
        </div>

        {/* Event List - Click to Select */}
        {hostEvents.length > 1 && (
          <div style={{ marginTop: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Your Events</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {hostEvents.map(e => (
                <button
                  key={e.id}
                  onClick={() => onSelectEvent?.(e.id)}
                  style={{
                    background: e.id === myEvent.id ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                    border: `1px solid ${e.id === myEvent.id ? 'var(--purple)' : 'rgba(255,255,255,0.1)'}`,
                    color: 'white',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(el) => {
                    if (el.currentTarget.style.background === 'transparent') {
                      el.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(el) => {
                    if (e.id !== myEvent.id) {
                      el.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{e.title}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--amber)' }}>{e.isActive ? '●' : '○'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats and Content Section */}
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Users size={20} color="var(--amber)" style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{myEvent.expectedPurchases || 0}</p>
            <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Planned Visits</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <BarChart3 size={20} color="var(--blue)" style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>$452</p>
            <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Est. Earnings</p>
          </div>
        </div>

        {/* Nearby Events Placeholder */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Nearby Events</h3>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center' }}>
            <Calendar size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>No other events scheduled tonight</p>
          </div>
        </div>

        {/* Requests Section */}
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
      
      {/* Footer / Location verification */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', margin: 0 }}>
          Location verified: {myEvent.address || "Coordinate selection active"}
        </p>
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: '1.5rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid var(--border)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Host New Event</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit}>
              {submitError && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  fontSize: '0.875rem',
                }}>
                  {submitError}
                </div>
              )}
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Live Music Night"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe your event..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="1">Musical</option>
                  <option value="2">Dance</option>
                  <option value="3">Art</option>
                  <option value="4">Shop</option>
                  <option value="5">Service</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Event Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Booking Link
                </label>
                <input
                  type="url"
                  name="bookingLink"
                  value={formData.bookingLink}
                  onChange={handleFormChange}
                  placeholder="https://example.com/booking"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  placeholder="Event location address"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid var(--purple)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={16} color="var(--purple)" />
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', margin: 0 }}>
                    Event Location on Map
                  </label>
                </div>
                {draftLocation ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--purple)', margin: 0, fontWeight: 'bold' }}>
                    ✓ Location selected: {formData.address || 'No address entered'}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.75rem', color: 'var(--amber)', margin: 0 }}>
                    Click on the map to pin your event location
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Event Image (Optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
                {formData.image && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--purple)', marginTop: '0.5rem', margin: 0 }}>
                    ✓ {formData.image.name}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setSubmitError(null);
                  }}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.5 : 1,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: 'var(--purple)',
                    color: 'white',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? 'Hosting...' : 'Host Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPanel;