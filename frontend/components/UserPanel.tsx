import React, { useState } from "react";
import { Events, UserProfile } from "../types";
import { Search, MapPin, Sparkles, Calendar } from "lucide-react";
import EventDetail from "./EventDetail";

interface UserPanelProps {
  user: UserProfile;
  events: Event[];
  selectedEvent: Event | null;
  onCloseEvent: () => void;
  onSelectEvent: (id: string) => void;
}

const UserPanel: React.FC<UserPanelProps> = ({
  user,
  events,
  selectedEvent,
  onCloseEvent,
  onSelectEvent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(events.map(e => e.category)));

  const filteredEvents = events.filter(e => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !activeCategory || e.category === activeCategory;

    return matchesSearch && matchesCategory;
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
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-scroll no-scrollbar">
          <button
            onClick={() => setActiveCategory(null)}
            className={`cat-chip ${!activeCategory ? "active" : ""}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cat-chip ${
                activeCategory === cat ? "active" : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="vendor-list no-scrollbar">
        {filteredEvents.length === 0 ? (
          <div className="empty-state">
            <MapPin size={48} />
            <p>No events nearby</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className="vendor-card"
              onClick={() => onSelectEvent(event.id)}
            >
              <h3 className="font-bold">{event.title}</h3>
              <p className="text-xs text-muted">{event.category}</p>

              <div className="flex justify-between mt-2 text-xs">
                <span className={event.isActive ? "live" : "closed"}>
                  {event.isActive ? "Happening" : "Upcoming"}
                </span>
                <Calendar size={14} />
              </div>
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
