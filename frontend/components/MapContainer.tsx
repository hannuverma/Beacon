import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

interface Vendor {
  id: string;
  name: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface MapProps {
  vendors: Vendor[];
  userLocation: {
    lat: number;
    lng: number;
  };
  selectedVendorId: string | null;
  onVendorSelect: (id: string) => void;
}

const NightMap = ({
  vendors,
  userLocation,
  onVendorSelect,
  selectedVendorId,
}: MapProps) => {
  const centerLat =
    userLocation.lat !== 0 ? userLocation.lat : DEFAULT_CENTER.lat;
  const centerLng =
    userLocation.lng !== 0 ? userLocation.lng : DEFAULT_CENTER.lng;
  const centerLat =
    userLocation.lat !== 0 ? userLocation.lat : DEFAULT_CENTER.lat;
  const centerLng =
    userLocation.lng !== 0 ? userLocation.lng : DEFAULT_CENTER.lng;
  if (!userLocation) return null;
  console.log("userLocation:", userLocation);
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      zoomControl={false}
      style={{ height: "100vh", width: "100%" }}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution="© OpenStreetMap © Stadia Maps"
      />
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
      {/* Vendor markers */}
      {vendors.map((v) => (
  <Marker
    key={v.id}
    icon={vendorIcon}
    position={[v.location.lat, v.location.lng]}
  >
    <Tooltip
      direction="top"
      offset={[-3, -16]}
      opacity={1}
      className="night-tooltip"
    >
      <div className="night-popup">
        <div className="night-popup-title">{v.name}</div>
        <div className="night-popup-sub">{v.category}</div>

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