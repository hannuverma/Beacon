import React, { useState } from "react";
import { AppView, Vendor, UserProfile } from "./types";
import { INITIAL_VENDORS } from "./mockData";
import UserPanel from "./components/UserPanel";
import VendorPanel from "./components/VendorPanel";
import MapContainer from "./components/MapContainer";
import AuthPanel from "./components/AuthPanel";
import { Moon, Store, User, LogOut } from "lucide-react";
import "./leafletFix";
import { useUserLocation } from "./src/userLocation";

const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.2090 }; // Delhi

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  const handleAuth = (profile: UserProfile) => {
    setUser(profile);
    setView(profile.role === "VENDOR" ? AppView.VENDOR : AppView.USER);
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.AUTH);
  };

  const toggleVendorStatus = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isOpen: !v.isOpen } : v))
    );
  };

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId) || null;

  // 🔹 compute derived location INSIDE component
  const mapUserLocation =
    gpsLocation ?? user?.homeLocation ?? DEFAULT_LOCATION;

  if (view === AppView.AUTH) {
    return <AuthPanel onAuthComplete={handleAuth} />;
  }

  if (locationError) {
    console.error("Location error:", locationError);
  }

  if (!mapUserLocation) {
    return <div className="loading-screen">Fetching location…</div>;
  }

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <Moon size={40} color="var(--amber)" fill="var(--amber)" />
        </div>
        
        <button 
          onClick={() => setView(AppView.USER)}
          className={`sidebar-btn ${
            view === AppView.USER ? "active user" : ""
          }`}
          title="User Mode"
        >
          <User size={24} />
        </button>

        {user?.role === "VENDOR" && (
          <button
            onClick={() => setView(AppView.VENDOR)}
            className={`sidebar-btn ${
              view === AppView.VENDOR ? "active vendor" : ""
            }`}
            title="Vendor Mode"
          >
            <Store size={24} />
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
        <div className="map-layer">
          <MapContainer
            vendors={vendors}
            onVendorSelect={setSelectedVendorId}
            selectedVendorId={selectedVendorId}
            userLocation={mapUserLocation}
          />
        </div>

        <div className="panel-container">
          <div className="panel-inner">
            {view === AppView.USER ? (
              <UserPanel 
                user={user!}
                vendors={vendors}
                selectedVendor={selectedVendor}
                onCloseVendor={() => setSelectedVendorId(null)}
                onSelectVendor={setSelectedVendorId}
              />
            ) : (
              <VendorPanel
                vendors={vendors}
                onToggleStatus={toggleVendorStatus}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
