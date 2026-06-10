
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { useMemo } from 'react';

const profileFormSchema = (t: (key: string) => string) => z.object({
  displayName: z.string().min(2, t('settings.profile.validation.displayNameMin')),
  email: z.string().email(t('settings.profile.validation.emailInvalid')),
});

const languageFormSchema = z.object({
    language: z.string(),
    zoneId: z.string(),
});

const securityFormSchema = z.object({
    mfaEnabled: z.boolean(),
});

export default function SettingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const currentProfileFormSchema = useMemo(() => profileFormSchema(t), [t]);
  
  type ProfileFormValues = z.infer<typeof currentProfileFormSchema>;
  type LanguageFormValues = z.infer<typeof languageFormSchema>;
  type SecurityFormValues = z.infer<typeof securityFormSchema>;

  const defaultProfileValues: Partial<ProfileFormValues> = {
    displayName: 'John Doe',
    email: 'j.doe@example.com',
  };

  const defaultLanguageValues: Partial<LanguageFormValues> = {
      language: 'en',
      zoneId: 'ZONE-NORTH-1A',
  };

  const defaultSecurityValues: Partial<SecurityFormValues> = {
      mfaEnabled: true,
  };

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(currentProfileFormSchema),
    defaultValues: defaultProfileValues,
    mode: 'onChange',
  });
  
  const languageForm = useForm<LanguageFormValues>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: defaultLanguageValues,
    mode: 'onChange',
  });

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: defaultSecurityValues,
    mode: 'onChange',
  });


  function onProfileSubmit(data: ProfileFormValues) {
    toast({
      title: t('settings.profile.toast.title'),
      description: t('settings.profile.toast.description'),
    });
  }

  function onLanguageSubmit(data: any) {
     toast({
      title: t('settings.language.toast.title'),
      description: t('settings.language.toast.description'),
    });
  }
  
  function onSecuritySubmit(data: any) {
     toast({
      title: t('settings.security.toast.title'),
      description: t('settings.security.toast.description'),
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('settings.description')}
        </p>
      </section>

      <div className="grid gap-6">
        <Card>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <CardHeader>
                <CardTitle>{t('settings.profile.title')}</CardTitle>
                <CardDescription>
                  {t('settings.profile.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('settings.profile.displayName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('settings.profile.displayNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t('settings.profile.emailPlaceholder')} {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('settings.profile.emailDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit">{t('common.saveChanges')}</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card>
            <Form {...languageForm}>
              <form onSubmit={languageForm.handleSubmit(onLanguageSubmit)}>
                <CardHeader>
                    <CardTitle>{t('settings.language.title')}</CardTitle>
                    <CardDescription>
                       {t('settings.language.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                    control={languageForm.control}
                    name="language"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('settings.language.preferredLanguage')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('settings.language.selectPlaceholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={languageForm.control}
                        name="zoneId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('settings.language.zoneId')}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    {t('settings.language.zoneIdDescription')}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit">{t('settings.language.saveButton')}</Button>
                </CardFooter>
              </form>
            </Form>
        </Card>
        
         <Card>
            <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
                    <CardHeader>
                        <CardTitle>{t('settings.security.title')}</CardTitle>
                        <CardDescription>
                            {t('settings.security.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={securityForm.control}
                            name="mfaEnabled"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <FormLabel>{t('settings.security.mfaLabel')}</FormLabel>
                                        <FormDescription>
                                            {t('settings.security.mfaDescription')}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            aria-label={t('settings.security.mfaAriaLabel')}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit">{t('settings.security.saveButton')}</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
      </div>
    </div>
  );
}
