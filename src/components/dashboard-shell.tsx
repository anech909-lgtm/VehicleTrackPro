
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Car,
  FileText,
  LayoutDashboard,
  Map,
  Siren,
  Users,
  Settings,
  ScanBarcode,
} from 'lucide-react';
import { AppHeader } from '@/components/header';
import { FirebaseErrorListener } from '@/components/firebase-error-listener';
import { useTranslation } from '@/hooks/use-translation';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { href: '/', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { href: '/drivers', label: t('sidebar.drivers'), icon: Users },
    { href: '/vehicles', label: t('sidebar.vehicles'), icon: Car },
    { href: '/tracking', label: t('sidebar.tracking'), icon: Map },
    { href: '/reports', label: t('sidebar.reports'), icon: FileText },
    { href: '/emergency', label: t('sidebar.emergency'), icon: Siren },
    { href: '/scan', label: 'Scan QR', icon: ScanBarcode },
  ];

  return (
    <SidebarProvider>
       <FirebaseErrorListener />
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-headline text-lg font-bold">
              {t('sidebar.appTitle')}
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={t('sidebar.settings')}
                asChild
                isActive={pathname === '/settings'}
              >
                <Link href="/settings">
                  <Settings />
                  <span>{t('sidebar.settings')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
