import React, { useState } from "react";
import { Events, UserProfile } from "../types";
import { ChevronLeft, MapPin, Calendar, ExternalLink } from "lucide-react";

interface EventDetailProps {
  event: Event;
  user: UserProfile;
  onBack: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, user, onBack }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="shop-hero">
        {event.image && (
          <img src={event.image} alt={event.title} className="hero-img" />
        )}
        <button onClick={onBack} className="back-btn">
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <span className="status-badge live">
          {event.isActive ? "Live Event" : "Upcoming"}
        </span>

        <h2 className="text-2xl font-bold mt-2">{event.title}</h2>
        <p className="text-sm text-muted mt-1">{event.description}</p>

        <div className="info-card mt-6">
          <MapPin size={18} />
          <span>{event.location.address}</span>
        </div>

        <div className="info-card">
          <Calendar size={18} />
          <span>{new Date(event.startTime).toLocaleString()}</span>
        </div>

        {event.bookingLink && (
          <a
            href={event.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="auth-submit mt-6 flex items-center gap-2"
          >
            <ExternalLink size={16} />
            Book / Learn More
          </a>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
