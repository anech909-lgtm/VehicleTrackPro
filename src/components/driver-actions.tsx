
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, FilePenLine, MessageSquare, Phone, Mail, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import type { Driver } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { useTranslation } from '@/hooks/use-translation';

export function DriverActions({ driver }: { driver: Driver }) {
  const { t } = useTranslation();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const { toast } = useToast();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t('driverActions.toggleMenu')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsDetailsOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            {t('driverActions.viewProfile')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
            <FilePenLine className="mr-2 h-4 w-4" />
            {t('common.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsMessageOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            {t('driverActions.message')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Profile Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="items-center text-center">
             <Avatar className="h-20 w-20">
                <AvatarImage
                    src={driver.photoUrl}
                    alt={driver.legalName}
                    data-ai-hint="driver avatar"
                />
                <AvatarFallback>
                    {driver.legalName.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-2xl">{driver.legalName}</DialogTitle>
            <DialogDescription>{t('driverActions.driverId')}: {driver.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4"/>
                    <span>Email</span>
                </div>
                <span className="font-medium">{driver.contact.email}</span>
            </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4"/>
                    <span>{t('driverActions.phone')}</span>
                </div>
                <span className="font-medium">{driver.contact.phone}</span>
            </div>

            <Separator/>
            
             <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-xs text-muted-foreground">{t('driverActions.performance')}</p>
                    <p className="font-semibold text-lg">{driver.performance.score}%</p>
                </div>
                 <div>
                    <p className="text-xs text-muted-foreground">{t('driverActions.trips')}</p>
                    <p className="font-semibold text-lg">{driver.performance.tripsCompleted}</p>
                </div>
                 <div>
                    <p className="text-xs text-muted-foreground">{t('driverActions.avgSpeed')}</p>
                    <p className="font-semibold text-lg">{driver.performance.avgSpeed} km/h</p>
                </div>
            </div>

            {driver.credentials.length > 0 && <Separator />}
             {driver.credentials.length > 0 && <div className="space-y-2">
                <h4 className="font-semibold">{t('driverActions.credentials')}</h4>
                {driver.credentials.map((c,i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                           <FileText className="h-4 w-4 text-muted-foreground" />
                           <span className="text-muted-foreground">{c.type}</span>
                        </div>
                        {c.expiresAt && <span className="font-medium">{t('driverActions.expires')} {format(new Date(c.expiresAt), "PP")}</span>}
                    </div>
                ))}
            </div>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Driver Sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{t('driverActions.editProfileTitle')}</SheetTitle>
            <SheetDescription>
              {t('driverActions.editProfileDescription', { name: driver.legalName })}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">{t('driverActions.legalName')}</label>
                <Input defaultValue={driver.legalName} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">{t('driverActions.emailAddress')}</label>
                <Input type="email" defaultValue={driver.contact.email} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">{t('driverActions.phoneNumber')}</label>
                <Input type="tel" defaultValue={driver.contact.phone} />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">{t('driverActions.assignedSector')}</label>
                <Input defaultValue={driver.sector || ''} />
            </div>
            <Button className="w-full" onClick={() => {
                toast({ title: t('driverActions.toast.profileUpdated.title'), description: t('driverActions.toast.profileUpdated.description', { name: driver.legalName }) });
                setIsEditOpen(false);
            }}>{t('common.saveChanges')}</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Message Driver Dialog */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('driverActions.messageDriverTitle', { name: driver.legalName })}</DialogTitle>
            <DialogDescription>
              {t('driverActions.messageDriverDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea placeholder={t('driverActions.messagePlaceholder')} rows={5} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={() => {
                toast({ title: t('driverActions.toast.messageSent.title'), description: t('driverActions.toast.messageSent.description', { name: driver.legalName }) });
                setIsMessageOpen(false);
            }}>{t('driverActions.sendMessage')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
