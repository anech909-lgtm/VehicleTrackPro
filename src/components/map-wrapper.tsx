'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { Vehicle } from '@/lib/types';

// Dynamically import the map component with SSR disabled
// This is required because Leaflet requires the window object to be defined
const DynamicMap = dynamic(() => import('./map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-muted/20 border rounded-lg">
      <Skeleton className="w-full h-full absolute inset-0" />
      <div className="z-10 flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground font-medium">Loading interactive map...</p>
      </div>
    </div>
  ),
});

export function MapWrapper({ 
  vehicles, 
  selectedVehicle 
}: { 
  vehicles: Vehicle[], 
  selectedVehicle: Vehicle | null 
}) {
  return <DynamicMap vehicles={vehicles} selectedVehicle={selectedVehicle} />;
}