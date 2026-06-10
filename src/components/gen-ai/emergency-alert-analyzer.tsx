
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Bot } from "lucide-react";
import type { EmergencyAlert } from "@/lib/types";
import { handleAnalyzeAlert } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";
import { useTranslation } from "@/hooks/use-translation";

type EmergencyAlertAnalyzerProps = {
  alert: EmergencyAlert;
  onAnalysisComplete: (alertId: string, analysis: NonNullable<EmergencyAlert['analysis']>) => void;
};

export function EmergencyAlertAnalyzer({
  alert,
  onAnalysisComplete,
}: EmergencyAlertAnalyzerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EmergencyAlert['analysis']>(null);
  const { toast } = useToast();

  const onAnalyze = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await handleAnalyzeAlert({
        alertDetails: alert.details,
        vehicleId: alert.vehicleId,
        driverId: alert.driverId,
      });
      setAnalysisResult(result);
      if (result) {
        onAnalysisComplete(alert.id, result);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: t('emergency.aiAnalyzer.toast.analysisFailed.title'),
        description: t('emergency.aiAnalyzer.toast.analysisFailed.description'),
      });
    } finally {
      setIsLoading(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Sparkles className="mr-2 h-4 w-4" /> {t('emergency.aiAnalyzer.buttonText')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('emergency.aiAnalyzer.title')}</DialogTitle>
          <DialogDescription>
            {t('emergency.aiAnalyzer.description', { id: alert.id })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-md border bg-background p-4">
            <h4 className="mb-2 font-semibold">{t('emergency.aiAnalyzer.incomingDetails')}</h4>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{t('emergency.aiAnalyzer.vehicle')}:</span> {alert.vehicleId}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{t('emergency.aiAnalyzer.driver')}:</span> {alert.driverId}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{t('emergency.aiAnalyzer.location')}:</span> {alert.location.lat.toFixed(4)}°, {alert.location.lng.toFixed(4)}°
            </p>
            <p className="mt-2 text-sm">{alert.details}</p>
          </div>

          {analysisResult && (
            <div className="space-y-4 rounded-lg border border-primary/50 bg-secondary/30 p-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary"/>
                <h4 className="font-semibold text-primary">{t('emergency.aiAnalyzer.analysisComplete')}</h4>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t('emergency.aiAnalyzer.priority')}</p>
                <Badge variant={getPriorityVariant(analysisResult.priority)} className={analysisResult.priority === 'medium' ? 'bg-accent text-accent-foreground' : ''}>
                    {t(`priorities.${analysisResult.priority}`)}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t('emergency.aiAnalyzer.suggestedActions')}</p>
                <p className="text-sm">{analysisResult.suggestedActions}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{t('emergency.aiAnalyzer.reasoning')}</p>
                <p className="text-sm font-light">{analysisResult.reasoning}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            {t('common.close')}
          </Button>
          {!analysisResult && (
            <Button onClick={onAnalyze} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isLoading ? t('emergency.aiAnalyzer.analyzing') : t('emergency.aiAnalyzer.runAnalysis')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
