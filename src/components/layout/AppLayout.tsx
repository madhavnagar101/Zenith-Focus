import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [monkMode, setMonkMode] = useState(false);
  const [blueLightFilter, setBlueLightFilter] = useState(false);

  return (
    <div
      className={cn(
        "min-h-screen flex w-full bg-background transition-all duration-500",
        monkMode && "monk-mode",
        blueLightFilter && "blue-light-filter"
      )}
    >
      <AppSidebar
        monkMode={monkMode}
        setMonkMode={setMonkMode}
        blueLightFilter={blueLightFilter}
        setBlueLightFilter={setBlueLightFilter}
      />
      <main className="flex-1 min-h-screen pb-20 lg:pb-0 overflow-x-hidden">
        <Outlet context={{ monkMode, setMonkMode, blueLightFilter, setBlueLightFilter }} />
      </main>
      <MobileNav />
    </div>
  );
}
