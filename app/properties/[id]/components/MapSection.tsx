import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { FaMapMarkerAlt } from 'react-icons/fa';
import MapComponent from '../../../../components/MapComponent';

interface MapSectionProps {
  latitude: number | undefined;
  longitude: number | undefined;
  isEditing: boolean;
  onInputChange: (name: string, value: string | number) => void;
}

const MapSection: React.FC<MapSectionProps> = ({
  latitude,
  longitude,
  isEditing,
  onInputChange,
}) => {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [address, setAddress] = useState('');

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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleAddressSubmit = async () => {
    // Google Maps Geocoding APIを使用して住所を緯度経度に変換
    // 結果を使ってonInputChangeを呼び出す
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      onInputChange('latitude', event.latLng.lat());
      onInputChange('longitude', event.latLng.lng());
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        onInputChange('latitude', position.coords.latitude);
        onInputChange('longitude', position.coords.longitude);
      });
    }
  };

  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-indigo-600" /> 地図
      </Typography>
      {isEditing ? (
        <>
          <TextField
            fullWidth
            name="address"
            label="住所"
            value={address}
            onChange={handleAddressChange}
            className="mb-4"
          />
          <Button onClick={handleAddressSubmit}>住所から位置を設定</Button>
          <Button onClick={handleUseCurrentLocation}>現在地を使用</Button>
          <TextField
            fullWidth
            name="latitude"
            label="緯度"
            type="number"
            value={latitude || ''}
            onChange={(e) => onInputChange('latitude', e.target.value)}
            className="mb-4"
          />
          <TextField
            fullWidth
            name="longitude"
            label="経度"
            type="number"
            value={longitude || ''}
            onChange={(e) => onInputChange('longitude', e.target.value)}
            className="mb-4"
          />
          {mapsLoaded && (
            <MapComponent
              lat={latitude || 0}
              lng={longitude || 0}
              onMapClick={handleMapClick}
              isEditable={true}
            />
          )}
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