
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addVehicle, updateVehicle } from "@/firebase/firestore/mutations";
import type { Firestore } from "firebase/firestore";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { useTranslation } from "@/hooks/use-translation";
import { useMemo } from "react";


const getFormSchema = (t: (key: string) => string) => z.object({
  make: z.string().min(1, t('addVehicle.validation.makeRequired')),
  model: z.string().min(1, t('addVehicle.validation.modelRequired')),
  year: z.coerce.number().min(1900, t('addVehicle.validation.yearInvalid')).max(new Date().getFullYear() + 1),
  plateNumber: z.string().min(1, t('addVehicle.validation.plateRequired')),
  chassisNumber: z.string().min(1, t('addVehicle.validation.chassisRequired')),
  insurance: z.object({
    provider: z.string().min(1, t('addVehicle.validation.insuranceProviderRequired')),
    policyNo: z.string().min(1, t('addVehicle.validation.policyNoRequired')),
    expiresAt: z.date({
      required_error: t('addVehicle.validation.expiryDateRequired'),
    }),
  }),
});

interface AddVehicleFormProps {
  db: Firestore | null;
  setOpen: (open: boolean) => void;
  vehicle?: Vehicle;
}

export function AddVehicleForm({ db, setOpen, vehicle }: AddVehicleFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isEditMode = !!vehicle;

  const formSchema = useMemo(() => getFormSchema(t), [t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode ? {
      ...vehicle,
      year: vehicle.year,
      insurance: {
        ...vehicle.insurance,
        expiresAt: new Date(vehicle.insurance.expiresAt),
      }
    } : {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      plateNumber: "",
      chassisNumber: "",
      insurance: {
        provider: "",
        policyNo: "",
        expiresAt: undefined,
      },
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
    
    const vehicleData = {
      ...values,
      insurance: {
        ...values.insurance,
        expiresAt: values.insurance.expiresAt.toISOString(),
      },
    };

    try {
        if (isEditMode && vehicle) {
          await updateVehicle(db, vehicle.id, vehicleData);
           toast({
            title: t('addVehicle.toast.updateTitle'),
            description: t('addVehicle.toast.updateDescription', { make: vehicleData.make, model: vehicleData.model }),
        });
        } else {
            const newVehicle = {
                ...vehicleData,
                status: 'Idle',
                location: { lat: 0, lng: 0 },
                registrationDocs: [],
                maintenance: [],
            };
            await addVehicle(db, newVehicle);
            toast({
                title: t('addVehicle.toast.addTitle'),
                description: t('addVehicle.toast.addDescription', { make: newVehicle.make, model: newVehicle.model }),
            });
        }
        setOpen(false);
    } catch (error) {
        console.error("Error processing vehicle: ", error);
        toast({
            variant: "destructive",
            title: t('errors.title'),
            description: t('errors.processVehicle'),
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addVehicle.form.make.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('addVehicle.form.make.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addVehicle.form.model.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('addVehicle.form.model.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addVehicle.form.year.label')}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={t('addVehicle.form.year.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addVehicle.form.plate.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('addVehicle.form.plate.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="chassisNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('addVehicle.form.chassis.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('addVehicle.form.chassis.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4 rounded-md border p-4">
            <h3 className="font-medium">{t('addVehicle.form.insurance.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="insurance.provider"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('addVehicle.form.insurance.provider.label')}</FormLabel>
                        <FormControl>
                        <Input placeholder={t('addVehicle.form.insurance.provider.placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="insurance.policyNo"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('addVehicle.form.insurance.policyNo.label')}</FormLabel>
                        <FormControl>
                        <Input placeholder={t('addVehicle.form.insurance.policyNo.placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="insurance.expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('addVehicle.form.insurance.expiresAt.label')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t('addVehicle.form.insurance.expiresAt.placeholder')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <Button type="submit" className="w-full">{isEditMode ? t('common.saveChanges') : t('addVehicle.form.submit')}</Button>
      </form>
    </Form>
  );
}
