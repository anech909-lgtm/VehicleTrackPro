
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmergencyAlertAnalyzer } from "@/components/gen-ai/emergency-alert-analyzer";
import type { EmergencyAlert } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { AddEmergencyAlertForm } from "@/components/add-emergency-alert-form";
import { updateEmergencyAlert } from "@/firebase/firestore/mutations";
import { useToast } from "@/hooks/use-toast";
import { emergencyAlerts as placeholderAlerts } from "@/lib/placeholder-data";
import { useTranslation } from "@/hooks/use-translation";

export default function EmergencyPage() {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();
  const { data: alerts, loading } = { data: placeholderAlerts, loading: false };

  const handleAnalysisComplete = (alertId: string, analysis: EmergencyAlert['analysis']) => {
    if (!db) {
      toast({
        variant: "destructive",
        title: t('errors.dbNotConnected.title'),
        description: t('errors.dbNotConnected.description'),
      });
      return;
    }
    const alertRef = doc(db, "emergencyAlerts", alertId);
    updateEmergencyAlert(alertRef, { analysis, status: 'Analyzing' });
    
    const index = alerts.findIndex(a => a.id === alertId);
    if(index !== -1) {
      alerts[index].analysis = analysis;
      alerts[index].status = 'Analyzing';
    }
  };
  
  const getPriorityVariant = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            {t('emergency.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('emergency.description')}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>{t('emergency.addNewAlert')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('emergency.addNewAlert')}</DialogTitle>
              <DialogDescription>
                {t('emergency.addAlertDescription')}
              </DialogDescription>
            </DialogHeader>
            <AddEmergencyAlertForm db={db} setOpen={setIsDialogOpen} />
          </DialogContent>
        </Dialog>
      </section>

      {loading && <p>{t('common.loading')}...</p>}
      
      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {alerts.map((alert) => (
            <Card key={alert.id} id={alert.id} className={`scroll-mt-20 target:animate-highlight ${alert.status === 'New' ? 'border-primary' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                          <span>{alert.vehicleId}</span>
                          <Badge variant={getPriorityVariant(alert.priority)} className={alert.priority === 'medium' ? 'bg-accent text-accent-foreground' : ''}>{t(`priorities.${alert.priority}`)}</Badge>
                      </CardTitle>
                      <CardDescription>{new Date(alert.timestamp).toLocaleString()} - {alert.location.lat.toFixed(4)}°, {alert.location.lng.toFixed(4)}°</CardDescription>
                    </div>
                     <Badge variant="outline">{t(`alertStatuses.${alert.status.toLowerCase()}`)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{alert.details}</p>
                
                {alert.analysis && (
                  <div className="space-y-3 rounded-lg border bg-secondary/50 p-4">
                      <h4 className="font-semibold">{t('emergency.aiAnalysis.title')}</h4>
                      <div>
                          <p className="text-xs font-semibold text-muted-foreground">{t('emergency.aiAnalysis.suggestedActions')}</p>
                          <p className="text-sm">{alert.analysis.suggestedActions}</p>
                      </div>
                       <div>
                          <p className="text-xs font-semibold text-muted-foreground">{t('emergency.aiAnalysis.reasoning')}</p>
                          <p className="text-sm">{alert.analysis.reasoning}</p>
                      </div>
                  </div>
                )}

                {alert.status !== 'Resolved' && (
                  <EmergencyAlertAnalyzer alert={alert} onAnalysisComplete={handleAnalysisComplete} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
