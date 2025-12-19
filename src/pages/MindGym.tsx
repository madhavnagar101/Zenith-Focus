import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Clock,
  Target,
  BookOpen,
  Play,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TheoryCard {
  id: string;
  title: string;
  icon: string;
  summary: string;
  details: string;
  color: "primary" | "accent" | "destructive";
}

const theoryCards: TheoryCard[] = [
  {
    id: "switch-cost",
    title: "Switch Cost Effect",
    icon: "🔄",
    summary: "Every tab switch costs 23 minutes",
    details: "When you switch tasks, your brain doesn't instantly reset. Research by Gloria Mark at UC Irvine shows it takes an average of 23 minutes and 15 seconds to fully return to the original task. This 'attention residue' accumulates throughout the day, leaving you mentally exhausted despite feeling busy.",
    color: "destructive",
  },
  {
    id: "cognitive-load",
    title: "Cognitive Load Theory",
    icon: "🪣",
    summary: "Your brain is a bucket that overflows",
    details: "Working memory can only hold 4-7 chunks of information at once. When you exceed this limit—through multiple tabs, notifications, or complex tasks—information literally 'spills out.' This is why simplifying your environment dramatically improves learning and retention.",
    color: "accent",
  },
  {
    id: "digital-amnesia",
    title: "Digital Amnesia",
    icon: "🧠",
    summary: "The danger of the Google Effect",
    details: "Studies show we're less likely to remember information we know we can look up. This 'Google Effect' means we're outsourcing our memory to devices. While convenient, it weakens the neural pathways needed for deep thinking and creative connections.",
    color: "primary",
  },
];

// Schulte Table Game
function SchulteTable() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const shuffleNumbers = () => {
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return nums;
  };

  const startGame = () => {
    setNumbers(shuffleNumbers());
    setCurrentNumber(1);
    setStartTime(Date.now());
    setEndTime(null);
    setGameStarted(true);
  };

  const handleClick = (num: number) => {
    if (num === currentNumber) {
      if (currentNumber === 25) {
        setEndTime(Date.now());
      } else {
        setCurrentNumber(currentNumber + 1);
      }
    }
  };

  const getElapsedTime = () => {
    if (!startTime) return "0:00";
    const elapsed = (endTime || Date.now()) - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Schulte Table
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {getElapsedTime()}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Find numbers 1-25 in order as fast as possible. Improves peripheral vision and focus.
      </p>
      
      {!gameStarted ? (
        <Button onClick={startGame} className="w-full bg-primary hover:bg-primary/90">
          <Play className="w-4 h-4 mr-2" />
          Start Game
        </Button>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {numbers.map((num, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick(num)}
                className={cn(
                  "aspect-square rounded-lg font-display font-bold text-lg flex items-center justify-center transition-colors",
                  num < currentNumber
                    ? "bg-success/20 text-success"
                    : "glass hover:bg-white/10 text-foreground"
                )}
                disabled={endTime !== null}
              >
                {num}
              </motion.button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">
              Find: <span className="text-primary font-bold">{currentNumber}</span>
            </p>
            {endTime && (
              <Button variant="outline" size="sm" onClick={startGame}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            )}
          </div>
        </>
      )}
    </GlassCard>
  );
}

// Box Breathing Exercise
function BoxBreathing() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          setPhase((p) => {
            switch (p) {
              case "inhale": return "hold1";
              case "hold1": return "exhale";
              case "exhale": return "hold2";
              case "hold2": return "inhale";
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const phaseLabels = {
    inhale: "Breathe In",
    hold1: "Hold",
    exhale: "Breathe Out",
    hold2: "Hold",
  };

  return (
    <GlassCard className="p-6">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4">
        Box Breathing
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        4-4-4-4 technique used by Navy SEALs to reduce stress and improve focus.
      </p>
      
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-6">
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary"
            animate={{
              scale: isActive ? [1, 1.1, 1.1, 1, 1] : 1,
              opacity: isActive ? [0.5, 1, 1, 0.5, 0.5] : 0.5,
            }}
            transition={{
              duration: 16,
              repeat: isActive ? Infinity : 0,
              ease: "linear",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isActive ? (
              <>
                <span className="text-4xl font-display font-bold text-primary">{count}</span>
                <span className="text-sm text-muted-foreground mt-2">{phaseLabels[phase]}</span>
              </>
            ) : (
              <span className="text-muted-foreground text-sm text-center px-4">
                Tap to start breathing exercise
              </span>
            )}
          </div>
        </div>
        
        <Button
          onClick={() => setIsActive(!isActive)}
          variant={isActive ? "destructive" : "default"}
          className="w-full"
        >
          {isActive ? "Stop" : "Begin Exercise"}
        </Button>
      </div>
    </GlassCard>
  );
}

export default function MindGym() {
  const [selectedCard, setSelectedCard] = useState<TheoryCard | null>(null);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
            Mind Gym
          </h1>
          <p className="text-muted-foreground mt-1">
            Education & focus drills to rewire your brain
          </p>
        </div>
      </motion.div>

      {/* Theory Cards Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-xl text-foreground">
            The Library of 'Why'
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {theoryCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                className="p-6 cursor-pointer hover:bg-white/10 transition-all group h-full"
                onClick={() => setSelectedCard(card)}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4",
                  card.color === "primary" && "bg-primary/20",
                  card.color === "accent" && "bg-accent/20",
                  card.color === "destructive" && "bg-destructive/20"
                )}>
                  {card.icon}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">{card.summary}</p>
                <div className="flex items-center gap-1 mt-4 text-primary text-sm group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Theory Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="max-w-lg p-8">
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6",
                  selectedCard.color === "primary" && "bg-primary/20",
                  selectedCard.color === "accent" && "bg-accent/20",
                  selectedCard.color === "destructive" && "bg-destructive/20"
                )}>
                  {selectedCard.icon}
                </div>
                <h2 className="font-display font-bold text-2xl text-foreground mb-4">
                  {selectedCard.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {selectedCard.details}
                </p>
                <Button
                  onClick={() => setSelectedCard(null)}
                  className="w-full"
                >
                  Got it!
                </Button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drills Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-accent" />
          <h2 className="font-display font-semibold text-xl text-foreground">
            Focus Drills
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SchulteTable />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <BoxBreathing />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
