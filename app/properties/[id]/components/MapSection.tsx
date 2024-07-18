import React, { useState, useEffect } from 'react';
import { Typography, TextField } from '@mui/material';
import { FaMapMarkerAlt } from 'react-icons/fa';
import MapComponent from '../../../../components/MapComponent';

interface MapSectionProps {
  latitude: number | undefined;
  longitude: number | undefined;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MapSection: React.FC<MapSectionProps> = ({
  latitude,
  longitude,
  isEditing,
  onInputChange,
}) => {
  const [mapsLoaded, setMapsLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapsLoaded(true);
      document.body.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-indigo-600" /> 地図
      </Typography>
      {isEditing ? (
        <>
          <TextField
            fullWidth
            name="latitude"
            label="緯度"
            type="number"
            value={latitude || ''}
            onChange={onInputChange}
            className="mb-4"
          />
          <TextField
            fullWidth
            name="longitude"
            label="経度"
            type="number"
            value={longitude || ''}
            onChange={onInputChange}
            className="mb-4"
          />
        </>
      ) : (
        latitude && longitude && mapsLoaded ? (
          <MapComponent 
            lat={latitude} 
            lng={longitude} 
          />
        ) : (
          <Typography>地図情報が利用できません</Typography>
        )
      )}
    </section>
  );
};

export default MapSection;