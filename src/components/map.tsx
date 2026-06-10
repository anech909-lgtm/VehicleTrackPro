'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Vehicle } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

// Component to handle map centering when a vehicle is selected
function MapController({ selectedVehicle }: { selectedVehicle: Vehicle | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedVehicle && selectedVehicle.location) {
      map.flyTo([selectedVehicle.location.lat, selectedVehicle.location.lng], 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedVehicle, map]);

  return null;
}

// Custom icons based on vehicle status
const createStatusIcon = (status: Vehicle['status']) => {
  let color = '#3b82f6'; // default blue
  if (status === 'Idle') color = '#64748b'; // secondary gray
  if (status === 'Emergency') color = '#ef4444'; // destructive red
  
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

export default function TrackingMap({ 
  vehicles, 
  selectedVehicle 
}: { 
  vehicles: Vehicle[], 
  selectedVehicle: Vehicle | null 
}) {
  // Default center (can be USA center or average of vehicles)
  const defaultCenter: [number, number] = vehicles.length > 0 && vehicles[0].location
    ? [vehicles[0].location.lat, vehicles[0].location.lng]
    : [39.8283, -98.5795];

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={4} 
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {vehicles.map((vehicle) => {
          if (!vehicle.location) return null;
          
          return (
            <Marker 
              key={vehicle.id} 
              position={[vehicle.location.lat, vehicle.location.lng]}
              icon={createStatusIcon(vehicle.status)}
            >
              <Popup>
                <div className="font-sans min-w-[200px] p-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-base m-0">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <Badge variant={
                      vehicle.status === 'Moving' ? 'default' : 
                      vehicle.status === 'Idle' ? 'secondary' : 'destructive'
                    } className="text-[10px] px-1 py-0 h-4">
                      {vehicle.status}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1 text-gray-600">
                    <p className="m-0"><span className="font-semibold text-gray-900">Plate:</span> {vehicle.plateNumber}</p>
                    <p className="m-0"><span className="font-semibold text-gray-900">Driver:</span> {vehicle.driverId || 'Unassigned'}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        <MapController selectedVehicle={selectedVehicle} />
      </MapContainer>
    </div>
  );
}