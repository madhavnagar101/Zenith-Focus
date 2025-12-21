import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Users,
  Gift,
  Timer,
  Flame,
  Crown,
  Ghost,
  Sparkles,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: "active" | "away" | "left";
  streak: number;
  xp: number;
}

const participants: Participant[] = [
  { id: "1", name: "Alex", avatar: "👤", status: "active", streak: 7, xp: 1250 },
  { id: "2", name: "Jordan", avatar: "🧑", status: "active", streak: 5, xp: 980 },
  { id: "3", name: "Sam", avatar: "👩", status: "away", streak: 3, xp: 750 },
  { id: "4", name: "Taylor", avatar: "🧔", status: "active", streak: 12, xp: 2100 },
  { id: "5", name: "Casey", avatar: "👱", status: "left", streak: 0, xp: 320 },
  { id: "6", name: "Morgan", avatar: "👨", status: "active", streak: 4, xp: 890 },
  { id: "7", name: "Riley", avatar: "🧑‍🦱", status: "active", streak: 8, xp: 1400 },
  { id: "8", name: "Quinn", avatar: "👩‍🦰", status: "active", streak: 20, xp: 3000 },
  { id: "9", name: "Avery", avatar: "👱‍♀️", status: "away", streak: 1, xp: 200 },
  { id: "10", name: "Parker", avatar: "👨‍🦱", status: "active", streak: 6, xp: 1100 },
  { id: "11", name: "Dakota", avatar: "👩‍🦳", status: "active", streak: 9, xp: 1600 },
  { id: "12", name: "Reese", avatar: "👨‍🦲", status: "active", streak: 15, xp: 2500 },
];

interface LootItem {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: string;
}

const lootPool: LootItem[] = [
  { id: "1", name: "Focus Badge", rarity: "common", icon: "🎯" },
  { id: "2", name: "Streak Shield", rarity: "rare", icon: "🛡️" },
  { id: "3", name: "Grayscale Skin", rarity: "epic", icon: "🌑" },
  { id: "4", name: "Zen Master Crown", rarity: "legendary", icon: "👑" },
  { id: "5", name: "XP Boost", rarity: "common", icon: "⚡" },
  { id: "6", name: "Time Crystal", rarity: "rare", icon: "💎" },
];

export default function JOMOArena() {
  const [showTemptation, setShowTemptation] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const [showLootBox, setShowLootBox] = useState(false);
  const [openedLoot, setOpenedLoot] = useState<LootItem | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [inventory, setInventory] = useState<LootItem[]>([]);
  const [focusStreak, setFocusStreak] = useState(5);

  // 7-second countdown
  useEffect(() => {
    if (showTemptation && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showTemptation, countdown]);

  const handleTemptationClick = () => {
    setShowTemptation(true);
    setCountdown(7);
  };

  const handleStayStrong = () => {
    setShowTemptation(false);
    setFocusStreak(prev => prev + 1);
  };

  const handleWeak = () => {
    setShowTemptation(false);
    setFocusStreak(0);
  };

  const handleOpenLootBox = () => {
    setIsOpening(true);
    setTimeout(() => {
      const randomLoot = lootPool[Math.floor(Math.random() * lootPool.length)];
      setOpenedLoot(randomLoot);
      setInventory(prev => [...prev, randomLoot]);
      setIsOpening(false);
    }, 2000);
  };

  const rarityColors = {
    common: "text-muted-foreground border-muted",
    rare: "text-primary border-primary",
    epic: "text-purple-400 border-purple-400",
    legendary: "text-accent border-accent",
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Temptation Overlay */}
      <AnimatePresence>
        {showTemptation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          >
            <GlassCard className="p-8 max-w-md text-center border-destructive/30">
              <div className="w-20 h-20 mx-auto rounded-full bg-destructive/20 flex items-center justify-center mb-6">
                <motion.span
                  className="text-5xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  ⏰
                </motion.span>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                7-Second Rule
              </h2>
              <p className="text-muted-foreground mb-6">
                The urge to distract yourself will pass. Wait it out.
              </p>

              <div className="text-6xl font-display font-bold text-destructive mb-8">
                {countdown}
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={handleWeak}
                  disabled={countdown > 0}
                >
                  I'm Weak
                </Button>
                <Button
                  className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                  onClick={handleStayStrong}
                  disabled={countdown > 0}
                >
                  Stay Strong
                </Button>
              </div>

              {countdown > 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Wait for the countdown to make your choice...
                </p>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loot Box Modal */}
      <AnimatePresence>
        {showLootBox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          >
            <GlassCard className="p-8 max-w-md text-center relative">
              <button
                onClick={() => {
                  setShowLootBox(false);
                  setOpenedLoot(null);
                }}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              {!openedLoot ? (
                <>
                  <motion.div
                    className="w-32 h-32 mx-auto mb-6 relative"
                    animate={isOpening ? { rotateY: [0, 360], scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  >
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <Gift className="w-16 h-16 text-primary-foreground" />
                    </div>
                    {isOpening && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{ boxShadow: ["0 0 20px #f59e0b", "0 0 60px #06b6d4", "0 0 20px #f59e0b"] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                    Focus Reward Chest
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Earned from your {focusStreak}-day focus streak!
                  </p>
                  <Button
                    onClick={handleOpenLootBox}
                    disabled={isOpening}
                    className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90"
                  >
                    {isOpening ? "Opening..." : "Open Chest"}
                  </Button>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
                  <span className="text-6xl block mb-4">{openedLoot.icon}</span>
                  <h3 className={cn(
                    "text-xl font-display font-bold mb-2",
                    rarityColors[openedLoot.rarity]
                  )}>
                    {openedLoot.name}
                  </h3>
                  <span className={cn(
                    "text-sm uppercase tracking-wider",
                    rarityColors[openedLoot.rarity]
                  )}>
                    {openedLoot.rarity}
                  </span>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
            JOMO Arena
          </h1>
          <p className="text-muted-foreground mt-1">
            Joy of Missing Out • Social accountability
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
            <Flame className="w-4 h-4 text-accent" />
            <span className="font-semibold">{focusStreak} day streak</span>
          </div>
        </div>
      </motion.div>

      {/* JOMO Social Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-lg text-foreground">
                Focus Room
              </h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {participants.filter(p => p.status === "active").length} focusing now
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 glass-strong rounded-xl text-center relative",
                  participant.status === "left" && "opacity-50"
                )}
              >
                {participant.streak >= 10 && (
                  <Crown className="w-4 h-4 text-accent absolute -top-2 -right-2" />
                )}
                <div className="relative inline-block mb-2">
                  <span className="text-4xl">{participant.avatar}</span>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card",
                    participant.status === "active" && "bg-success",
                    participant.status === "away" && "bg-accent",
                    participant.status === "left" && "bg-destructive"
                  )}>
                    {participant.status === "left" && (
                      <Ghost className="w-3 h-3 text-destructive-foreground" />
                    )}
                  </div>
                </div>
                <p className="font-medium text-sm text-foreground">{participant.name}</p>
                <p className="text-xs text-muted-foreground">🔥 {participant.streak}d</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 7-Second Rule Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Timer className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  7-Second Rule
                </h3>
                <p className="text-sm text-muted-foreground">Resist the urge to distract</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Feeling the urge to check your phone or social media? Press the button and wait 7 seconds.
              Most cravings pass within this window.
            </p>
            <Button
              onClick={handleTemptationClick}
              variant="outline"
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              I'm Tempted...
            </Button>
          </GlassCard>
        </motion.div>

        {/* Loot Box */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  Focus Rewards
                </h3>
                <p className="text-sm text-muted-foreground">Earn loot from focus streaks</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Complete focus streaks to earn reward chests. Collect rare badges and unlock unique theme skins!
            </p>
            <Button
              onClick={() => setShowLootBox(true)}
              className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90"
            >
              <Gift className="w-4 h-4 mr-2" />
              Open Reward Chest
            </Button>
          </GlassCard>
        </motion.div>
      </div>

      {/* Inventory */}
      {inventory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Your Inventory
            </h3>
            <div className="flex flex-wrap gap-3">
              {inventory.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-4 py-2 glass-strong rounded-xl flex items-center gap-2 border",
                    rarityColors[item.rarity]
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
