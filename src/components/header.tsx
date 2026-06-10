
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslation } from "@/hooks/use-translation";

export function AppHeader() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const pageTitles: { [key: string]: string } = {
    "/": t('pageTitles.dashboard'),
    "/drivers": t('pageTitles.drivers'),
    "/vehicles": t('pageTitles.vehicles'),
    "/tracking": t('pageTitles.tracking'),
    "/reports": t('pageTitles.reports'),
    "/emergency": t('pageTitles.emergency'),
    "/settings": t('pageTitles.settings'),
  };
  
  const title = pageTitles[pathname] || "VehicleTrack Pro";

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="hidden text-xl font-semibold font-headline md:block">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  );
}
