
'use client';

import { useMemo, useState } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Vehicle } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { vehicles as placeholderVehicles } from '@/lib/placeholder-data';
import { MapWrapper } from '@/components/map-wrapper';
import { useTranslation } from '@/hooks/use-translation';

export default function TrackingPage() {
  const { t } = useTranslation();
  const db = useFirestore();
  const vehiclesCollection = useMemo(
    () => (db ? collection(db, 'vehicles') : null),
    [db]
  );
  const { data: vehiclesData, loading: vehiclesLoading } = useCollection<Vehicle>(vehiclesCollection);
  
  // Use placeholder data if firestore is empty so the dashboard always looks populated
  const vehicles = (vehiclesData && vehiclesData.length > 0) ? vehiclesData : placeholderVehicles;
  const isLoading = vehiclesLoading && (!vehiclesData || vehiclesData.length === 0);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const getStatusVariant = (status: Vehicle['status']) => {
    switch (status) {
      case 'Moving':
        return 'default';
      case 'Idle':
        return 'secondary';
      case 'Emergency':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <section>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {t('tracking.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('tracking.description')}
        </p>
      </section>
      <div className="grid h-[calc(100vh-14rem)] grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-1 glass-card flex flex-col">
          <CardHeader>
            <CardTitle>{t('tracking.vehiclesTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto p-0 md:p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('tracking.table.vehicle')}</TableHead>
                    <TableHead>{t('tracking.table.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow
                      key={vehicle.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedVehicle(vehicle)}
                      data-state={
                        selectedVehicle?.id === vehicle.id ? 'selected' : ''
                      }
                    >
                      <TableCell className="font-medium">
                        {vehicle.make} {vehicle.model}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(vehicle.status)}>
                          {t(`vehicleStatuses.${vehicle.status.toLowerCase()}`)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <div className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm flex min-h-[400px]">
           <MapWrapper vehicles={vehicles} selectedVehicle={selectedVehicle} />
        </div>
      </div>
    </div>
  );
}
