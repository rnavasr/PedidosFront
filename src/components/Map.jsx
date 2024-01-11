import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import {Button} from 'antd';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const [center, setCenter] = useState([-1.0241157747979186, -79.46108497663826]); 
  const [marker, setMarker] = useState(null);

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
        setMarker({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  };

  const handleCancel = () => {
    setMarker(null);
  };

  const MapClickHandler = () => {
    useMapEvent('click', (event) => {
      if (!marker) {
        const { lat, lng } = event.latlng;
        setMarker({ latitude: lat, longitude: lng });
      }
    });

    return null;
  };

  return (

    <>
      <h2>Ubicación Guardada</h2>
      <div >

{marker && (
  <ul>
    <li>{`Latitud: ${marker.latitude.toFixed(4)}`}</li>
    <li>{`Longitud: ${marker.longitude.toFixed(4)}`}</li>
  </ul>
)}
</div>
      <div style={{ display: 'flex'}}>

      
        <div style={{ display: 'flex' }}>

          
          <div>
            <Button onClick={handleGetCurrentLocation}>Obtener Ubicación Actual</Button>
            <Button onClick={handleCancel}>Cancelar</Button>

            <MapContainer center={center} zoom={13} style={{ height: '500px', width: '300%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <MapClickHandler />

              {marker && (
                <Marker position={[marker.latitude, marker.longitude]}>
                  <Popup>{`Latitud: ${marker.latitude.toFixed(4)}, Longitud: ${marker.longitude.toFixed(
                    4
                  )}`}</Popup>
                </Marker>
              )}
            </MapContainer>


          </div>

        </div>

      </div>
    </>


  );
};

export default Map;







