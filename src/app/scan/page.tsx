'use client';

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { vehicles as placeholderVehicles } from '@/lib/placeholder-data';
import type { Vehicle } from '@/lib/types';
import { CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ScanPage() {
  const [scannedVehicle, setScannedVehicle] = useState<Vehicle | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue;
      try {
        // Try to parse the new JSON payload
        const parsedVehicle = JSON.parse(code);
        if (parsedVehicle && parsedVehicle.id && parsedVehicle.plateNumber) {
          setScannedVehicle(parsedVehicle as Vehicle);
          setIsScanning(false);
          setScanError(null);
          return;
        }
      } catch (e) {
        // Not JSON, fallback to legacy ID format
      }

      // Legacy format fallback: 'vehicle:123'
      if (typeof code === 'string' && code.startsWith('vehicle:')) {
        const id = code.split(':')[1];
        const vehicle = placeholderVehicles.find((v) => v.id === id);
        if (vehicle) {
          setScannedVehicle(vehicle);
          setIsScanning(false);
          setScanError(null);
        } else {
          setScanError('Vehicle not found in database.');
        }
      } else {
        setScanError('Invalid QR code format. Not a vehicle QR.');
      }
    }
  };

  const handleReset = () => {
    setScannedVehicle(null);
    setScanError(null);
    setIsScanning(true);
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      <section>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Scan QR Code
        </h1>
        <p className="text-muted-foreground">
          Scan a vehicle's QR sticker to verify its details.
        </p>
      </section>

      {isScanning && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square w-full max-w-md mx-auto relative bg-black">
              <Scanner
                onScan={handleScan}
                formats={['qr_code']}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {scanError && (
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-6 w-6" />
              <CardTitle>Scan Error</CardTitle>
            </div>
            <CardDescription>{scanError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleReset} variant="outline" className="w-full">
              <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {scannedVehicle && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary mb-2">
              <CheckCircle2 className="h-6 w-6" />
              <CardTitle>Vehicle Verified</CardTitle>
            </div>
            <CardDescription>
              This vehicle is confirmed to belong to our department.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Make & Model</span>
                <span className="font-medium text-lg">{scannedVehicle.make} {scannedVehicle.model} ({scannedVehicle.year})</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Status</span>
                <Badge variant={scannedVehicle.status === 'Moving' ? 'default' : scannedVehicle.status === 'Idle' ? 'secondary' : 'destructive'}>
                  {scannedVehicle.status}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">License Plate</span>
                <span className="font-medium font-code">{scannedVehicle.plateNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Chassis Number</span>
                <span className="font-medium font-code">{scannedVehicle.chassisNumber}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block mb-1">Assigned Driver</span>
                <span className="font-medium">{scannedVehicle.driverId || 'Unassigned'}</span>
              </div>
            </div>

            <Separator />

            <Button onClick={handleReset} className="w-full">
              <RefreshCcw className="mr-2 h-4 w-4" /> Scan Another
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
