// EventLocationPicker.tsx
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function LocationMarker({ setLocation }: any) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLocation({ lat, lng });
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function EventLocationPicker({ setLocation }: any) {
  return (
    <MapContainer
      center={[28.6139, 77.2090]} // default center (Delhi for example)
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker setLocation={setLocation} />
    </MapContainer>
  );
}
