
"use client";

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Car,
  Users,
  Siren,
  Activity,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { vehicles, drivers, emergencyAlerts } from '@/lib/placeholder-data';
import type { Vehicle, Driver, EmergencyAlert } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';

const pieChartConfig = {
  Moving: { label: 'Moving', color: 'hsl(var(--chart-1))' },
  Idle: { label: 'Idle', color: 'hsl(var(--chart-2))' },
  Emergency: { label: 'Emergency', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig

export default function DashboardPage() {
  const { t } = useTranslation();

  const summaryStats = useMemo(() => {
    const onlineDriversCount = drivers.filter(d => d.status === 'Online').length;
    const movingVehiclesCount = vehicles.filter(v => v.status === 'Moving').length;

    return {
      totalVehicles: vehicles.length,
      driversOnline: onlineDriversCount,
      driversOnlinePercentage: drivers.length > 0 ? Math.round((onlineDriversCount / drivers.length) * 100) : 0,
      activeAlerts: emergencyAlerts.filter(a => a.status !== 'Resolved').length,
      fleetActivityPercentage: vehicles.length > 0 ? Math.round((movingVehiclesCount / vehicles.length) * 100) : 0
    };
  }, []);
  
  const recentAlerts = useMemo(() => {
    return [...emergencyAlerts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, []);

  const vehicleStatusData = useMemo(() => {
    const data = [
      { status: 'Moving', count: vehicles.filter(v => v.status === 'Moving').length, fill: 'var(--color-Moving)' },
      { status: 'Idle', count: vehicles.filter(v => v.status === 'Idle').length, fill: 'var(--color-Idle)' },
      { status: 'Emergency', count: vehicles.filter(v => v.status === 'Emergency').length, fill: 'var(--color-Emergency)' },
    ];
    
    // Add translated labels for the chart
    return data.map(item => ({
        ...item,
        status: t(`dashboard.vehicleStatus.${item.status.toLowerCase()}`),
    })).filter(item => item.count > 0);
  }, [t]);

  const isLoading = false;
  
  const translatedPieChartConfig: ChartConfig = useMemo(() => ({
    [t('dashboard.vehicleStatus.moving')]: { label: t('dashboard.vehicleStatus.moving'), color: 'hsl(var(--chart-1))' },
    [t('dashboard.vehicleStatus.idle')]: { label: t('dashboard.vehicleStatus.idle'), color: 'hsl(var(--chart-2))' },
    [t('dashboard.vehicleStatus.emergency')]: { label: t('dashboard.vehicleStatus.emergency'), color: 'hsl(var(--destructive))' },
  }), [t]);


  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard.description')}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalVehicles.title')}</CardTitle>
            <Car className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{summaryStats.totalVehicles}</div>}
            <p className="text-xs text-muted-foreground">
              {t('dashboard.totalVehicles.description')}
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.driversOnline.title')}</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{summaryStats.driversOnline}</div>}
            <p className="text-xs text-muted-foreground">
              {isLoading ? '...' : t('dashboard.driversOnline.description', { percentage: summaryStats.driversOnlinePercentage })}
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.activeAlerts.title')}</CardTitle>
            <Siren className="h-4 w-4 text-destructive animate-pulse" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold text-destructive">
              {summaryStats.activeAlerts}
            </div>}
            <p className="text-xs text-muted-foreground">
              {t('dashboard.activeAlerts.description')}
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.fleetActivity.title')}</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{summaryStats.fleetActivityPercentage}%</div>}
            <p className="text-xs text-muted-foreground">
              {t('dashboard.fleetActivity.description')}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="col-span-1 lg:col-span-3 glass-card">
          <CardHeader>
            <CardTitle>{t('dashboard.recentAlerts.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard.recentAlerts.vehicle')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('dashboard.recentAlerts.time')}</TableHead>
                  <TableHead>{t('dashboard.recentAlerts.priority')}</TableHead>
                  <TableHead className="text-right">{t('dashboard.recentAlerts.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAlerts.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">{t('dashboard.recentAlerts.noAlerts')}</TableCell>
                    </TableRow>
                )}
                {recentAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div className="font-medium">{alert.vehicleId}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {alert.driverId}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(alert.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          alert.priority === 'high'
                            ? 'destructive'
                            : alert.priority === 'medium'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={alert.priority === 'medium' ? 'bg-accent text-accent-foreground' : ''}
                      >
                        {t(`priorities.${alert.priority}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/emergency#${alert.id}`}>{t('common.view')}</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.vehicleStatus.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center h-[250px]">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                </div>
            ): vehicleStatusData.length === 0 ? (
                <div className="flex justify-center items-center h-[250px]">
                    <p className="text-muted-foreground">{t('dashboard.vehicleStatus.noData')}</p>
                </div>
            ) : (
             <ChartContainer
                config={translatedPieChartConfig}
                className="mx-auto aspect-square h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={vehicleStatusData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                     {vehicleStatusData.map((entry) => (
                       <Cell key={entry.status} fill={entry.fill as string} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
