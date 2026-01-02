import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Focus,
  Youtube,
  Brain,
  Trophy,
  BellOff,
  Moon,
  Sun,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  monkMode: boolean;
  setMonkMode: (value: boolean) => void;
  blueLightFilter: boolean;
  setBlueLightFilter: (value: boolean) => void;
}

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Command Center", description: "Dashboard & Sync" },
  { path: "/deep-work", icon: Focus, label: "Deep Work", description: "Anti-Cheat Focus" },
  { path: "/focus-tube", icon: Youtube, label: "Focus Tube", description: "Growth Videos", starred: true },
  { path: "/mind-gym", icon: Brain, label: "Mind Gym", description: "Education & Drills" },
  { path: "/jomo-arena", icon: Trophy, label: "JOMO Arena", description: "Social Accountability" },
  { path: "/notification-jail", icon: BellOff, label: "Notification Jail", description: "Batching Interface" },
];

export function AppSidebar({ monkMode, setMonkMode, blueLightFilter, setBlueLightFilter }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden lg:flex flex-col h-screen glass border-r border-white/10 sticky top-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/25">
                  <img src="/logo.png" alt="Zenith Focus" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg text-foreground">Zenith Focus</h1>
                  <p className="text-xs text-muted-foreground">Digital Wellbeing</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="w-10 h-10 mx-auto rounded-xl overflow-hidden shadow-lg shadow-primary/25">
              <img src="/logo.png" alt="Zenith Focus" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const NavContent = (
            <NavLink
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col min-w-0"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      {item.label}
                      {item.starred && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                />
              )}
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{NavContent}</TooltipTrigger>
                <TooltipContent side="right" className="z-[100] bg-popover text-popover-foreground border-border">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.path}>{NavContent}</div>;
        })}
      </nav>

      {/* Mode Toggles */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => setMonkMode(!monkMode)}
              className={cn(
                "w-full justify-start gap-3 px-3",
                monkMode && "bg-muted text-foreground"
              )}
            >
              <Moon className="w-5 h-5" />
              {!collapsed && <span className="text-sm">Monk Mode</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="z-[100] bg-popover text-popover-foreground border-border">
              <p>Monk Mode (Grayscale)</p>
            </TooltipContent>
          )}
        </Tooltip>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => setBlueLightFilter(!blueLightFilter)}
              className={cn(
                "w-full justify-start gap-3 px-3",
                blueLightFilter && "bg-accent/20 text-accent"
              )}
            >
              <Eye className="w-5 h-5" />
              {!collapsed && <span className="text-sm">Blue Light Filter</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="z-[100] bg-popover text-popover-foreground border-border">
              <p>Blue Light Filter</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>
    </motion.aside>
  );
}
