import React, { useState } from "react";
import { Events, UserProfile } from "../types"; // Changed 'Events' to 'Event' to match usage
import { Search, MapPin, Sparkles, Calendar } from "lucide-react";
import EventDetail from "./EventDetail";

interface UserPanelProps {
  user: UserProfile;
  events: Events[];
  selectedEvent: Events | null;
  selectedEventId: number | null;
  onCloseEvent: () => void;
  onSelectEvent: (id: number) => void;
}

const UserPanel: React.FC<UserPanelProps> = ({
  user,
  events,
  selectedEvent,
  onCloseEvent,
  onSelectEvent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeHostName, setActiveHostName] = useState<string | null>(null);

  // Extract unique host names from events
  const hostNames = Array.from(new Set(events.map((e) => (e as any).host_name).filter(Boolean)));

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHostName = !activeHostName || (e as any).host_name === activeHostName;

    return matchesSearch && matchesHostName;
  });

  if (selectedEvent) {
    return (
      <EventDetail
        event={selectedEvent}
        user={user}
        onBack={onCloseEvent}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="user-panel-header">
        <h2 className="font-outfit text-xl font-bold">Discover Events</h2>

        <p className="text-xs text-muted">
          Near {user.homeLocation?.address ?? "you"}
        </p>

        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search events"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-scroll no-scrollbar">
          <button
            onClick={() => setActiveHostName(null)}
            className={`cat-chip ${!activeHostName ? "active" : ""}`}
          >
            All Hosts
          </button>
          {hostNames.map((hostName) => (
            <button
              key={hostName}
              onClick={() => setActiveHostName(hostName)}
              className={`cat-chip ${activeHostName === hostName ? "active" : ""}`}
            >
              {hostName}
            </button>
          ))}
        </div>
      </div>

      <div className="vendor-list no-scrollbar" style={{ overflowY: 'auto' }}>
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <MapPin size={48} />
            <p>No events nearby</p>
          </div>
        ) : (
          filteredEvents.map((event, idx) => (
            <div key={event.id}>
              <div
                className="vendor-card"
                onClick={() => onSelectEvent(event.id)}
                style={{ margin: '0 0.75rem' }}
              >
                <h3 className="font-bold">{event.title}</h3>
                <p className="text-xs text-muted">{(event as any).host_name || 'Host'}</p>

                <div className="flex justify-between mt-2 text-xs">
                  <span className={event.isActive ? "live" : "closed"}>
                    {event.isActive ? "Happening" : "Upcoming"}
                  </span>
                  <Calendar size={14} />
                </div>
              </div>
              {idx < filteredEvents.length - 1 && (
                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '0.5rem 0' }} />
              )}
            </div>
          ))
        )}
      </div>

      <div className="panel-footer">
        <button className="auth-submit">
          <Sparkles size={18} />
          <span>Plan My Night</span>
        </button>
      </div>
    </div>
  );
};

export default UserPanel;