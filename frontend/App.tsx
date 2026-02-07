import React, { useState, useEffect  } from "react";
import { AppView, Events, UserProfile } from "./types";
import UserPanel from "./components/UserPanel";
import EventPanel from "./components/EventPanel";
import MapContainer from "./components/MapContainer";
import AuthPanel from "./components/AuthPanel";
import { Moon, Calendar, User, LogOut } from "lucide-react";
import "./leafletFix";
import { useUserLocation } from "./src/userLocation";
import axios from "axios";
import CreateEventForm from "./components/CreateEvent";

const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.2090 }; // Delhi

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [events, setEvents] = useState<Events[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [draftLocation, setDraftLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const selectedEvent =
  Array.isArray(events)
    ? events.find(e => e.id === selectedEventId) ?? null
    : null;

    
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/export/");
        setEvents(res.data.listings);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  const refetchEvents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/export/");
      setEvents(res.data.listings);
    } catch (error) {
      console.error("Failed to refetch events:", error);
    }
  };

  const mapUserLocation =
    gpsLocation ?? user?.homeLocation ?? DEFAULT_LOCATION;


  const handleAuth = (profile: UserProfile) => {
    setUser(profile);
    setView(profile.role === "HOST" ? AppView.HOST : AppView.USER);
    console.log("Logged in user:", profile);
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.AUTH);
  };

  const toggleEventStatus = (id: number) => {
    setEvents(prev =>
      prev.map(e =>
        e.id === id ? { ...e, isActive: !Boolean(e.isActive) } : e
      )
    );
  };


  if (view === AppView.AUTH) {
    return <AuthPanel onAuthComplete={handleAuth} />;
  }

  if (locationError) {
    console.error("Location error:", locationError);
  }

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <Moon size={40} color="var(--amber)" fill="var(--amber)" />
        </div>
        
        <button 
          onClick={() => setView(AppView.USER)}
          className={`sidebar-btn ${view === AppView.USER ? "active user" : ""}`}
          title="Explore Events"
        >
          <User size={24} />
        </button>

        {user?.role === "HOST" && (
          <button
            onClick={() => setView(AppView.HOST)}
            className={`sidebar-btn ${view === AppView.HOST ? "active host" : ""}`}
            title="Manage Events"
          >
            <Calendar size={24} />
          </button>
        )}

        <button 
          onClick={handleLogout}
          className="sidebar-btn sidebar-logout"
          title="Logout"
        >
          <LogOut size={24} />
        </button>
      </nav>

      <main className="main-content">
        {showCreateForm && (
          <CreateEventForm
            onClose={() => setShowCreateForm(false)}
          />
        )}
        <div className="map-layer">
          <MapContainer
            events={events}
            userLocation={mapUserLocation}
            draftLocation={draftLocation}
            onEventSelect={setSelectedEventId}
            selectedEventId={selectedEventId}
            onMapClick={(lat, lng) =>
              setDraftLocation({ lat, lng })
            }
          />
        </div>

        <div className="panel-container">
          <div className="panel-inner">
            {view === AppView.USER ? (
              <UserPanel 
                user={user!}
                events={events}
                selectedEvent={selectedEvent}
                onCloseEvent={() => setSelectedEventId(null)}
                onSelectEvent={setSelectedEventId}
              />
            ) : (
              <EventPanel
                events={events}
                user={user}
                draftLocation={draftLocation}
                onSetDraftLocation={setDraftLocation}
                onToggleStatus={toggleEventStatus}
                onCreateEvent={() => setShowCreateForm(true)}
                onEventCreated={refetchEvents}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
