import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Events } from "../types";


const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // fallback


export const vendorIcon = L.divIcon({
  className: "",
  html: `
    <div class="vendor-marker">
      <div class="vendor-pulse"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export const userIcon = L.divIcon({
  className: "",
  html: `
    <div class="user-marker">
      <div class="user-pulse"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export const draftIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: var(--amber);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 15px rgba(217, 119, 6, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface MapProps {
  events: Events[];
  userLocation: {
    lat: number;
    lng: number;
  };
  selectedEventId: string | null;
  draftLocation?: { lat: number; lng: number } | null;
  onEventSelect: (id: string) => void;
  onMapClick?: (lat: number, lng: number) => void; 
}

const MapClickHandler = ({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const NightMap = ({
  events,
  userLocation,
  onEventSelect,
  selectedEventId,
  draftLocation,
  onMapClick,
}: MapProps) => {
  const centerLat =
    userLocation.lat !== 0 ? userLocation.lat : DEFAULT_CENTER.lat;
  const centerLng =
    userLocation.lng !== 0 ? userLocation.lng : DEFAULT_CENTER.lng;
  if (!userLocation) return null;
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      zoomControl={false}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution="© OpenStreetMap © Stadia Maps"
      />
      <MapClickHandler onMapClick={onMapClick} />

      {/* User marker */}
      <Marker
        position={[userLocation.lat, userLocation.lng]}
        icon={userIcon}
      >
        <Tooltip
          direction="top"
          offset={[-3, -18]}
          opacity={1}
          className="night-tooltip"
        >
          <div className="night-popup">
            <div className="night-popup-title">You</div>
            <div className="night-popup-sub">Current location</div>
          </div>
        </Tooltip>
      </Marker>

      {/* Draft location marker - selected for new event */}
      {draftLocation && (
        <Marker
          position={[draftLocation.lat, draftLocation.lng]}
          icon={draftIcon}
        >
          <Tooltip
            direction="top"
            offset={[-3, -18]}
            opacity={1}
            className="night-tooltip"
          >
            <div className="night-popup">
              <div className="night-popup-title">New Event Location</div>
              <div className="night-popup-sub">{draftLocation.lat.toFixed(4)}, {draftLocation.lng.toFixed(4)}</div>
            </div>
          </Tooltip>
        </Marker>
      )}

      {/* Vendor markers */}
    {events
      .filter(e => e.latitude != null && e.longitude != null)
      .map(e => (
        <Marker
          key={e.id}
          icon={vendorIcon}
          position={[e.latitude, e.longitude]}
        >
    <Tooltip
      direction="top"
      offset={[-3, -16]}
      opacity={1}
      className="night-tooltip"
    >
      <div className="night-popup">
        <div className="night-popup-title">{e.title}</div>
        <div className="night-popup-sub">{e.category}</div>

        <div className="night-popup-meta">
          <span className="dot open" />
          <span>Live Now</span>
        </div>
      </div>
    </Tooltip>
  </Marker>
))}

    </MapContainer>
  );
};

export default NightMap;