
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Vehicle } from "@/lib/types";
import { useFirestore } from '@/firebase';
import { AddVehicleForm } from '@/components/add-vehicle-form';
import { vehicles as placeholderVehicles } from '@/lib/placeholder-data';
import { VehicleActions } from '@/components/vehicle-actions';
import { useTranslation } from '@/hooks/use-translation';

export default function VehiclesPage() {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const db = useFirestore();
  const [vehicles] = useState<Vehicle[]>(placeholderVehicles);
  const loading = false;

  const movingVehicles = useMemo(() => vehicles.filter((v) => v.status === "Moving"), [vehicles]);
  const idleVehicles = useMemo(() => vehicles.filter((v) => v.status === "Idle"), [vehicles]);
  const emergencyVehicles = useMemo(() => vehicles.filter((v) => v.status === "Emergency"), [vehicles]);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {t('vehicles.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('vehicles.description')}
        </p>
      </section>

      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
            <TabsTrigger value="moving">{t('vehicles.tabs.moving')}</TabsTrigger>
            <TabsTrigger value="idle">{t('vehicles.tabs.idle')}</TabsTrigger>
            <TabsTrigger value="emergency">{t('vehicles.tabs.emergency')}</TabsTrigger>
          </TabsList>
          <div className="ml-auto">
             <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>{t('vehicles.addNewVehicle')}</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('vehicles.addNewVehicle')}</DialogTitle>
                  <DialogDescription>
                    {t('vehicles.addVehicleDescription')}
                  </DialogDescription>
                </DialogHeader>
                <AddVehicleForm db={db} setOpen={setIsAddDialogOpen} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="all">
          <VehicleTable vehicles={vehicles} loading={loading} />
        </TabsContent>
        <TabsContent value="moving">
          <VehicleTable vehicles={movingVehicles} loading={loading} />
        </TabsContent>
        <TabsContent value="idle">
          <VehicleTable vehicles={idleVehicles} loading={loading} />
        </TabsContent>
        <TabsContent value="emergency">
          <VehicleTable vehicles={emergencyVehicles} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VehicleTable({ vehicles, loading }: { vehicles: Vehicle[]; loading: boolean }) {
  const { t } = useTranslation();

  const getBadgeVariant = (status: string) => {
      switch (status) {
          case 'Moving': return 'default';
          case 'Idle': return 'secondary';
          case 'Emergency': return 'destructive';
          default: return 'outline';
      }
  }
  
  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('vehicles.table.vehicle')}</TableHead>
              <TableHead>{t('vehicles.table.status')}</TableHead>
              <TableHead className="hidden md:table-cell">
                {t('vehicles.table.assignedDriver')}
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                {t('vehicles.table.licensePlate')}
              </TableHead>
              <TableHead>
                <span className="sr-only">{t('vehicles.table.actions')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t('common.loading')}...
                </TableCell>
              </TableRow>
            ) : vehicles.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        {t('vehicles.noVehiclesFound')}
                    </TableCell>
                </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                    <div className="text-sm text-muted-foreground">{vehicle.chassisNumber}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(vehicle.status)}>
                      {t(`vehicleStatuses.${vehicle.status.toLowerCase()}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {vehicle.driverId || t('common.unassigned')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-code">
                    {vehicle.plateNumber}
                  </TableCell>
                  <TableCell>
                    <VehicleActions vehicle={vehicle} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
