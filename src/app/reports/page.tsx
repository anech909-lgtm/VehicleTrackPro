
'use client';

import {
  Card,
  CardContent,
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
import { reports, vehicles, drivers, emergencyAlerts } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import type { Report } from "@/lib/types";
import { useTranslation } from "@/hooks/use-translation";

export default function ReportsPage() {
  const { t } = useTranslation();

  const handleExport = (report: Report) => {
    let data: any[] = [];
    let headers: string[] = [];
    let rawHeaders: string[] = [];

    switch (report.type) {
      case 'Usage':
        rawHeaders = ['id', 'make', 'model', 'driverId', 'status'];
        headers = rawHeaders.map(h => t(`reports.headers.${h}`));
        data = vehicles.map(v => ({ id: v.id, make: v.make, model: v.model, driver: v.driverId, status: v.status }));
        break;
      case 'Activity':
        rawHeaders = ['id', 'name', 'tripsCompleted', 'performanceScore', 'status'];
        headers = rawHeaders.map(h => t(`reports.headers.${h}`));
        data = drivers.map(d => ({ id: d.id, name: d.legalName, tripsCompleted: d.performance.tripsCompleted, performanceScore: d.performance.score, status: d.status }));
        break;
      case 'Alerts':
        rawHeaders = ['id', 'vehicleId', 'timestamp', 'priority', 'status', 'details'];
        headers = rawHeaders.map(h => t(`reports.headers.${h}`));
        data = emergencyAlerts.map(a => ({ id: a.id, vehicleId: a.vehicleId, timestamp: a.timestamp, priority: a.priority, status: a.status, details: a.details }));
        break;
      default:
        data = [{ message: "No data available for this report type." }];
        headers = ['message'];
        rawHeaders = ['message'];
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => rawHeaders.map(header => {
        let cell = row[header as keyof typeof row] ?? '';
        if(typeof cell === 'object') cell = JSON.stringify(cell);
        const strCell = String(cell);
        return `"${strCell.replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${report.title.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {t('reports.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('reports.description')}
        </p>
      </section>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('reports.table.title')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('reports.table.type')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('reports.table.dateGenerated')}</TableHead>
                <TableHead className="text-right">{t('reports.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground"/>
                      <span className="font-medium">{report.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{t(`reports.types.${report.type.toLowerCase()}`)}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(report.generatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleExport(report)}>
                      <Download className="mr-2 h-4 w-4" />
                      {t('common.export')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
