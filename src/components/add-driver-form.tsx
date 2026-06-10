
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
import type { Driver } from "@/lib/types";
import { useTranslation } from "@/hooks/use-translation";
import { useMemo } from "react";

const getFormSchema = (t: (key: string) => string) => z.object({
  legalName: z.string().min(2, t('addDriver.validation.nameRequired')),
  contact: z.object({
      email: z.string().email(t('addDriver.validation.emailInvalid')),
      phone: z.string().min(10, t('addDriver.validation.phoneRequired')),
  }),
  sector: z.string().optional(),
});

type FormValues = z.infer<ReturnType<typeof getFormSchema>>;

interface AddDriverFormProps {
  setOpen: (open: boolean) => void;
  onDriverAdded: (driverData: FormValues) => void;
}

export function AddDriverForm({ setOpen, onDriverAdded }: AddDriverFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const formSchema = useMemo(() => getFormSchema(t), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legalName: "",
      contact: {
        email: "",
        phone: "",
      },
      sector: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      onDriverAdded(values);
      toast({
        title: t('addDriver.toast.title'),
        description: t('addDriver.toast.description', { name: values.legalName }),
      });
      setOpen(false);
    } catch (error) {
      console.error("Error adding driver: ", error);
      toast({
        variant: "destructive",
        title: t('errors.title'),
        description: t('errors.addDriver'),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="legalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('addDriver.form.fullName.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('addDriver.form.fullName.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="contact.email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('addDriver.form.email.label')}</FormLabel>
                    <FormControl>
                    <Input type="email" placeholder={t('addDriver.form.email.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="contact.phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('addDriver.form.phone.label')}</FormLabel>
                    <FormControl>
                    <Input type="tel" placeholder={t('addDriver.form.phone.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
            <FormItem>
                <FormLabel>{t('addDriver.form.sector.label')}</FormLabel>
                <FormControl>
                <Input placeholder={t('addDriver.form.sector.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <Button type="submit" className="w-full">{t('addDriver.form.submit')}</Button>
      </form>
    </Form>
  );
}
