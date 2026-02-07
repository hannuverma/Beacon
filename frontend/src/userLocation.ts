import { useEffect, useState } from "react";

export const useUserLocation = () => {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => setError(err.message)
    );
  }, []);

  return { location, error };
};
