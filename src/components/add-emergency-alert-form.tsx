
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { vehicles, drivers } from "@/lib/placeholder-data";
import { type AddEmergencyAlert } from "@/lib/types";
import { addEmergencyAlert } from "@/firebase/firestore/mutations";
import { useToast } from "@/hooks/use-toast";
import { serverTimestamp } from "firebase/firestore";
import { useTranslation } from "@/hooks/use-translation";
import { useMemo } from "react";

const getFormSchema = (t: (key: string) => string) => z.object({
  vehicleId: z.string().min(1, t('addEmergencyAlert.validation.vehicleRequired')),
  driverId: z.string().min(1, t('addEmergencyAlert.validation.driverRequired')),
  location: z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
  }),
  details: z.string().min(10, t('addEmergencyAlert.validation.detailsMin')),
  priority: z.enum(["low", "medium", "high"]),
});

export function AddEmergencyAlertForm({ db, setOpen }: { db: any, setOpen: (open: boolean) => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const formSchema = useMemo(() => getFormSchema(t), [t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: "",
      driverId: "",
      location: { lat: 0, lng: 0 },
      details: "",
      priority: "medium",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!db) {
        toast({
            variant: "destructive",
            title: t('errors.dbNotConnected.title'),
            description: t('errors.dbNotConnected.description'),
        });
        return;
    }
    
    const newAlert: AddEmergencyAlert = {
        ...values,
        status: 'New',
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp(),
    };

    try {
        await addEmergencyAlert(db, newAlert);
        toast({
            title: t('addEmergencyAlert.toast.title'),
            description: t('addEmergencyAlert.toast.description'),
        });
        setOpen(false);
    } catch (error) {
        console.error("Error adding alert: ", error);
        toast({
            variant: "destructive",
            title: t('errors.title'),
            description: t('errors.addAlert'),
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('addEmergencyAlert.form.vehicle.label')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('addEmergencyAlert.form.vehicle.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.plateNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="driverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('addEmergencyAlert.form.driver.label')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('addEmergencyAlert.form.driver.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.legalName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location.lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addEmergencyAlert.form.latitude.label')}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={t('addEmergencyAlert.form.latitude.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location.lng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addEmergencyAlert.form.longitude.label')}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={t('addEmergencyAlert.form.longitude.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('addEmergencyAlert.form.details.label')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('addEmergencyAlert.form.details.placeholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('addEmergencyAlert.form.priority.label')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('addEmergencyAlert.form.priority.placeholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">{t('priorities.low')}</SelectItem>
                  <SelectItem value="medium">{t('priorities.medium')}</SelectItem>
                  <SelectItem value="high">{t('priorities.high')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">{t('addEmergencyAlert.form.submit')}</Button>
      </form>
    </Form>
  );
}
