
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { EmergencyAlert, Vehicle } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type AddEmergencyAlertProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAlertAdd: (alert: Omit<EmergencyAlert, 'id' | 'status'>) => void;
  vehicles: Vehicle[];
};

export function AddEmergencyAlert({
  isOpen,
  onOpenChange,
  onAlertAdd,
  vehicles,
}: AddEmergencyAlertProps) {
  const [vehicleId, setVehicleId] = useState<string>('');
  const [details, setDetails] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!vehicleId || !details || !location.lat || !location.lng) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all required fields.',
      });
      return;
    }

    const selectedVehicle = vehicles.find(v => v.id === vehicleId);

    onAlertAdd({
      vehicleId,
      driverId: selectedVehicle?.driverId || 'N/A',
      timestamp: new Date().toISOString(),
      location: {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
      },
      details,
      priority,
    });
    onOpenChange(false);
    // Reset form
    setVehicleId('');
    setDetails('');
    setPriority('high');
    setLocation({ lat: '', lng: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Manual Emergency Alert</DialogTitle>
          <DialogDescription>
            Log a new emergency alert for a vehicle in the fleet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="vehicle-id">Vehicle</Label>
            <Select onValueChange={setVehicleId} value={vehicleId}>
              <SelectTrigger id="vehicle-id">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="details">Alert Details</Label>
            <Textarea
              id="details"
              placeholder="Describe the emergency..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input id="lat" placeholder="e.g., 40.7128" value={location.lat} onChange={e => setLocation({...location, lat: e.target.value})} />
             </div>
             <div className="grid gap-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input id="lng" placeholder="e.g., -74.0060" value={location.lng} onChange={e => setLocation({...location, lng: e.target.value})} />
             </div>
           </div>
           <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select onValueChange={(v: 'high' | 'medium' | 'low') => setPriority(v)} value={priority}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Set priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Alert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
