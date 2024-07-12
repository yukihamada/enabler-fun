import React, { useEffect, useState } from 'react';

interface MapComponentProps {
  lat: number;
  lng: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ lat, lng }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && window.google) {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        const map = new window.google.maps.Map(mapElement, {
          center: { lat, lng },
          zoom: 15,
        });
        new window.google.maps.Marker({ position: { lat, lng }, map });
      }
    }
  }, [mapLoaded, lat, lng]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default MapComponent;