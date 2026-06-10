
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, UploadCloud, FilePenLine, Eye, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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
import type { Vehicle } from '@/lib/types';
import { AddVehicleForm } from './add-vehicle-form';
import { useFirestore } from '@/firebase';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { Separator } from './ui/separator';
import { useTranslation } from '@/hooks/use-translation';

export function VehicleActions({ vehicle }: { vehicle: Vehicle }) {
  const { t } = useTranslation();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const db = useFirestore();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t('vehicleActions.toggleMenu')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setIsDetailsOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            {t('vehicleActions.viewDetails')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
            <FilePenLine className="mr-2 h-4 w-4" />
            {t('common.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsUploadOpen(true)}>
            <UploadCloud className="mr-2 h-4 w-4" />
            {t('vehicleActions.uploadDocuments')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsQrOpen(true)}>
            <QrCode className="mr-2 h-4 w-4" />
            Generate QR
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {vehicle.make} {vehicle.model}
            </DialogTitle>
            <DialogDescription>
              {t('vehicleActions.detailsForLicense', { plate: vehicle.plateNumber })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('vehicleActions.status')}</span>
              <Badge
                variant={
                  vehicle.status === 'Moving'
                    ? 'default'
                    : vehicle.status === 'Idle'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {t(`vehicleStatuses.${vehicle.status.toLowerCase()}`)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('vehicleActions.year')}</span>
              <span className="font-medium">{vehicle.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('vehicleActions.chassisNumber')}</span>
              <span className="font-medium font-code">{vehicle.chassisNumber}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">{t('vehicleActions.assignedDriver')}</span>
              <span className="font-medium">{vehicle.driverId || t('common.unassigned')}</span>
            </div>
            <Separator />
            <div className="space-y-2">
                <h4 className="font-semibold">{t('vehicleActions.insuranceInfo')}</h4>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('vehicleActions.provider')}</span>
                    <span className="font-medium">{vehicle.insurance.provider}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('vehicleActions.policyNo')}</span>
                    <span className="font-medium font-code">{vehicle.insurance.policyNo}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('vehicleActions.expiresOn')}</span>
                    <span className="font-medium">{format(new Date(vehicle.insurance.expiresAt), "PPP")}</span>
                </div>
            </div>

             {vehicle.maintenance.length > 0 && <Separator />}
             {vehicle.maintenance.length > 0 && <div className="space-y-2">
                <h4 className="font-semibold">{t('vehicleActions.maintenanceHistory')}</h4>
                {vehicle.maintenance.map((m,i) => (
                    <div key={i} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{m.type} on {format(new Date(m.date), "PP")}</span>
                        <span className="font-medium">${m.cost}</span>
                    </div>
                ))}
            </div>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t('vehicleActions.editVehicleTitle')}</SheetTitle>
            <SheetDescription>
              {t('vehicleActions.editVehicleDescription', { plate: vehicle.plateNumber })}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
             <AddVehicleForm db={db} setOpen={setIsEditOpen} vehicle={vehicle} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Upload Documents Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('vehicleActions.uploadDocumentsTitle')}</DialogTitle>
            <DialogDescription>
              {t('vehicleActions.uploadDocumentsDescription', { make: vehicle.make, model: vehicle.model })}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-secondary">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">{t('vehicleActions.clickToUpload')}</span> {t('vehicleActions.orDragAndDrop')}</p>
                        <p className="text-xs text-muted-foreground">{t('vehicleActions.fileTypes')}</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                </label>
            </div> 
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>{t('common.cancel')}</Button>
            <Button>{t('common.upload')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate QR Dialog */}
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vehicle QR Sticker</DialogTitle>
            <DialogDescription>
              Review the details and print the sticker.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4 space-y-6">
            
            {/* The Printable Sticker */}
            <div id="print-sticker" className="w-full max-w-sm bg-white text-black p-6 rounded-2xl shadow-md border-2 border-primary/20 flex flex-col items-center gap-4">
              <div className="w-full text-center border-b pb-4">
                <h3 className="font-bold text-xl uppercase tracking-wider text-primary">Department of Transportation</h3>
                <p className="text-sm text-gray-500 font-medium tracking-widest mt-1">OFFICIAL VEHICLE</p>
              </div>
              
              <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <QRCodeSVG 
                  value={JSON.stringify({
                    id: vehicle.id,
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    plateNumber: vehicle.plateNumber,
                    chassisNumber: vehicle.chassisNumber,
                    driverId: vehicle.driverId || 'Unassigned',
                    status: vehicle.status
                  })} 
                  size={160}
                  level="M"
                  includeMargin={true}
                />
              </div>

              <div className="w-full grid grid-cols-2 gap-y-2 text-sm mt-2 px-2">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Make & Model</p>
                  <p className="font-bold text-gray-800">{vehicle.make} {vehicle.model}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Year</p>
                  <p className="font-bold text-gray-800">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">License Plate</p>
                  <p className="font-bold text-gray-800 font-code">{vehicle.plateNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Driver</p>
                  <p className="font-bold text-gray-800">{vehicle.driverId || 'Unassigned'}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center px-4">
              When scanned, this QR code will provide the encoded details directly to the app, without requiring a database lookup.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQrOpen(false)}>Close</Button>
            <Button onClick={() => {
              const printContent = document.getElementById('print-sticker');
              const originalContent = document.body.innerHTML;
              if (printContent) {
                // A very basic print approach for demonstration
                document.body.innerHTML = `<div style="display:flex;justify-content:center;padding:2rem;">${printContent.outerHTML}</div>`;
                window.print();
                document.body.innerHTML = originalContent;
                window.location.reload(); // Reload to restore React bindings
              } else {
                window.print();
              }
            }}>Print Sticker</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
