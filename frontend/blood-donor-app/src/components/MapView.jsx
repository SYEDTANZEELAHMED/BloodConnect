import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// expects donors = [{ lat, lng, name, bloodGroup, phone }] or [{ location: { coordinates: [lng, lat] }, name, bloodGroup, phone }]
export default function MapView({ center=[28.6139, 77.2090], donors=[] }){
  return (
    <div className="h-full w-full">
      <MapContainer 
        center={center} 
        zoom={13} 
        className="h-full w-full rounded-lg"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {donors.map(d => {
          // Handle both coordinate formats
          let lat, lng;
          if (d.location && d.location.coordinates) {
            [lng, lat] = d.location.coordinates;
          } else {
            lat = d.lat;
            lng = d.lng;
          }
          
          return (
            <Marker key={d._id} position={[lat, lng]}>
              <Popup>
                <div className="p-2">
                  <div className="font-semibold text-red-600">{d.name}</div>
                  <div className="text-sm text-gray-600">Blood Group: {d.bloodGroup}</div>
                  <div className="text-sm text-gray-600">Phone: {d.phone}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
