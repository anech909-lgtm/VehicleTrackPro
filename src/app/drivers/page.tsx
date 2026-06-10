
'use client';

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { Driver } from "@/lib/types";
import { useState, useMemo } from "react";
import { DriverActions } from "@/components/driver-actions";
import { AddDriverForm } from "@/components/add-driver-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { drivers as placeholderDrivers } from "@/lib/placeholder-data";
import { useTranslation } from "@/hooks/use-translation";

export default function DriversPage() {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [allDrivers, setAllDrivers] = useState<Driver[]>(placeholderDrivers);

  const onlineDrivers = useMemo(() => allDrivers.filter((d) => d.status === 'Online'), [allDrivers]);
  const offlineDrivers = useMemo(() => allDrivers.filter((d) => d.status === 'Offline'), [allDrivers]);
  
  const handleAddDriver = (newDriverData: Omit<Driver, 'id' | 'createdAt' | 'status' | 'photoUrl' | 'performance' | 'credentials' >) => {
    const newDriver: Driver = {
      id: `DRV${Math.floor(Math.random() * 900) + 100}`,
      status: 'Offline',
      photoUrl: `https://picsum.photos/seed/${Math.random()}/100/100`,
      performance: { score: 0, tripsCompleted: 0, avgSpeed: 0 },
      credentials: [],
      createdAt: new Date().toISOString(),
      ...newDriverData,
    };
    setAllDrivers(prevDrivers => [newDriver, ...prevDrivers]);
  };
  
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {t('drivers.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('drivers.description')}
        </p>
      </section>

      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
            <TabsTrigger value="online">{t('drivers.online')}</TabsTrigger>
            <TabsTrigger value="offline">{t('drivers.offline')}</TabsTrigger>
          </TabsList>
          <div className="ml-auto">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>{t('drivers.addNewDriver')}</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('drivers.addNewDriver')}</DialogTitle>
                  <DialogDescription>
                    {t('drivers.addDriverDescription')}
                  </DialogDescription>
                </DialogHeader>
                <AddDriverForm setOpen={setIsAddDialogOpen} onDriverAdded={handleAddDriver} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="all">
          <DriverTable drivers={allDrivers} />
        </TabsContent>
        <TabsContent value="online">
          <DriverTable drivers={onlineDrivers} />
        </TabsContent>
        <TabsContent value="offline">
          <DriverTable drivers={offlineDrivers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DriverTable({ drivers }: { drivers: Driver[]}) {
  const { t } = useTranslation();
  if (!drivers || drivers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>{t('drivers.noDriversFound')}</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('drivers.table.driver')}</TableHead>
              <TableHead>{t('drivers.table.status')}</TableHead>
              <TableHead className="hidden md:table-cell">
                {t('drivers.table.assignedVehicle')}
              </TableHead>
              <TableHead>
                <span className="sr-only">{t('drivers.table.actions')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={driver.photoUrl}
                        alt={driver.legalName}
                        data-ai-hint="driver avatar"
                      />
                      <AvatarFallback>
                        {driver.legalName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{driver.legalName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={driver.status === 'Online' ? "default" : "secondary"}
                    className={driver.status === 'Online' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20' : ''}
                  >
                    {t(`drivers.status.${driver.status.toLowerCase()}`)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {driver.activeVehicleId || t('common.na')}
                </TableCell>
                <TableCell>
                  <DriverActions driver={driver} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
