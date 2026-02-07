import React, { useState } from 'react';
// Map is the wrapper, Marker is the actual pin component
import Map, { Marker } from 'react-map-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css'; // CRITICAL: This keeps the map from looking broken

const MAPBOX_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN_HERE'; 

function SignupMap({ onLocationSelect }) {
  const [marker, setMarker] = useState(null);

  const handleMapClick = (e) => {
    // In newer versions of react-map-gl, coordinates are in e.lngLat
    const { lng, lat } = e.lngLat;
    setMarker({ lng, lat });
    
    // Pass the data back to the parent form (signup_host or signup_user)
    if (onLocationSelect) {
        onLocationSelect({ lat, lng });
    }
  };

  return (
    <div className="map-container" style={{ borderRadius: '8px', overflow: 'hidden' }}>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: 75.7873,
          latitude: 26.9124,
          zoom: 12
        }}
        style={{ width: '100%', height: 400 }}
        mapStyle="mapbox://styles/mapbox/dark-v10" // Dark mode looks great for hackathons
        onClick={handleMapClick}
      >
        {marker && (
          <Marker longitude={marker.lng} latitude={marker.lat} anchor="bottom">
            <div style={{ color: 'red', fontSize: '24px' }}>📍</div>
          </Marker>
        )}
      </Map>
    </div>
  );
}

export default SignupMap;