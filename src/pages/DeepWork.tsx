import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Type,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Brain,
  Zap,
  BellOff,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useFocusData } from "@/hooks/useFocusData";

// Convert text to bionic reading format
function toBionicText(text: string): JSX.Element {
  return (
    <>
      {text.split(" ").map((word, i) => {
        const boldLength = Math.ceil(word.length * 0.4);
        return (
          <span key={i} className="bionic-text">
            <b>{word.slice(0, boldLength)}</b>
            <span>{word.slice(boldLength)}</span>{" "}
          </span>
        );
      })}
    </>
  );
}

const quizQuestions = [
  {
    question: "What is the main concept discussed in the last segment?",
    options: ["Deep focus techniques", "Social media impact", "Time management", "Memory retention"],
    correct: 0,
  },
  {
    question: "How does context switching affect productivity?",
    options: ["Improves it by 50%", "Costs 23 minutes per switch", "Has no effect", "Speeds up work"],
    correct: 1,
  },
];

export default function DeepWork() {
  const { profile, logSession } = useFocusData();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes
  const [tunnelVision, setTunnelVision] = useState(false);
  const [bionicReading, setBionicReading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showPenalty, setShowPenalty] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);

  // New Integrated Features
  const [monkMode, setMonkMode] = useState(false);
  const [blockedNotifs, setBlockedNotifs] = useState(0);
  const [showSevenSecRule, setShowSevenSecRule] = useState(false);
  const [sevenSecCountdown, setSevenSecCountdown] = useState(7);

  // Toggle everything with Monk Mode
  const toggleMonkMode = (enabled: boolean) => {
    setMonkMode(enabled);
    setTunnelVision(enabled);
    setBionicReading(enabled);
    if (!enabled) setBlockedNotifs(0);
  };

  // Simulate incoming blocked notifications
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && monkMode) {
      interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 5s
          setBlockedNotifs(prev => prev + 1);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isRunning, monkMode]);

  // Seven Second Rule Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showSevenSecRule && sevenSecCountdown > 0) {
      interval = setInterval(() => {
        setSevenSecCountdown(prev => prev - 1);
      }, 1000);
    } else if (sevenSecCountdown === 0) {
      // Allow exit
    }
    return () => clearInterval(interval);
  }, [showSevenSecRule, sevenSecCountdown]);

  const handleStopAttempt = () => {
    if (monkMode && isRunning) {
      setShowSevenSecRule(true);
      setSevenSecCountdown(7);
      setIsRunning(false); // Pause timer during reflection
    } else {
      setIsRunning(!isRunning); // Standard toggle
    }
  };

  const confirmStop = () => {
    setShowSevenSecRule(false);
    setIsRunning(false); // Ensure it stays stopped
  };

  const cancelStop = () => {
    setShowSevenSecRule(false);
    setIsRunning(true); // Resume
  };

  // ... (Anti-cheat existing logic)
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isRunning) {
      setIsRunning(false);
      setIsVisible(false);
      setShowPenalty(true);
      setSessionXp((prev) => Math.max(0, prev - 25));
    } else {
      setIsVisible(true);
    }
  }, [isRunning]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

  // Session Completion Handler (Triggered when timer hits 0)
  const handleSessionComplete = async () => {
    const earnedXp = sessionXp + 50 + (monkMode ? 50 : 0); // Bonus for Monk Mode
    await logSession({
      durationSeconds: 25 * 60, // Default duration
      xpEarned: earnedXp,
      status: 'completed'
    });
    setSessionXp(0);
    setBlockedNotifs(0);
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          // Every 15 mins (900s), trigger quiz if not near end
          if (prev % 900 === 0 && prev !== 25 * 60) {
            setIsRunning(false);
            setShowQuiz(true);
          }
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTime(25 * 60);
    setIsRunning(false);
    setSessionXp(0);
    setBlockedNotifs(0);
    setShowSevenSecRule(false);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (answerIndex === quizQuestions[0].correct) {
      setSessionXp((prev) => prev + 50);
    }
    setShowQuiz(false);
    setIsRunning(true);
  };

  const sampleText = `The human brain is not designed for the constant context switching that modern technology demands. 
  Every time you check your phone or switch between apps, your prefrontal cortex needs approximately 23 minutes to fully 
  re-engage with the original task. This "attention residue" accumulates throughout the day, leaving you mentally exhausted 
  despite feeling like you accomplished little. Deep work, as coined by Cal Newport, is the ability to focus without 
  distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information 
  and produce better results in less time. In an economy that values complex problem-solving, deep work is becoming 
  increasingly rare—and therefore increasingly valuable.`;

  return (
    <div className={cn("p-4 lg:p-8 space-y-6 relative", tunnelVision && "tunnel-vision")}>
      {/* 7-Second Rule Overlay */}
      <AnimatePresence>
        {showSevenSecRule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          >
            <GlassCard className="p-8 max-w-md text-center border-destructive/30">
              <div className="w-20 h-20 mx-auto rounded-full bg-destructive/20 flex items-center justify-center mb-6">
                <motion.span
                  className="text-5xl font-display font-bold text-destructive"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {sevenSecCountdown}
                </motion.span>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Pausing Monk Mode...
              </h2>
              <p className="text-muted-foreground mb-8">
                Wait 7 seconds. Is this interruption worth breaking your flow state?
              </p>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={confirmStop}
                  disabled={sevenSecCountdown > 0}
                >
                  I Must Quit
                </Button>
                <Button
                  className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                  onClick={cancelStop}
                >
                  Stay Focused
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Penalty Overlay (Existing) */}
      <AnimatePresence>
        {showPenalty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          >
            <GlassCard className="p-8 max-w-md text-center border-destructive/50">
              <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Focus Broken
              </h2>
              <p className="text-muted-foreground mb-6">
                Material open but student absent. You lost <span className="text-destructive font-semibold">25 XP</span> for switching away.
              </p>
              <Button
                onClick={() => setShowPenalty(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                I Understand
              </Button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Modal (Existing) */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          >
            <GlassCard className="p-8 max-w-lg border-primary/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Active Recall Check
                  </h2>
                  <p className="text-sm text-muted-foreground">Answer to continue learning</p>
                </div>
              </div>
              <p className="text-lg text-foreground mb-6">{quizQuestions[0].question}</p>
              <div className="space-y-3">
                {quizQuestions[0].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(i)}
                    className="w-full p-4 glass rounded-xl text-left hover:bg-white/10 transition-colors"
                  >
                    <span className="text-primary font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                    {option}
                  </button>
                ))}
              </div>
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
            Deep Work
          </h1>
          <p className="text-muted-foreground mt-1">
            Anti-cheat enforced focus sessions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-semibold">{(profile?.total_xp || 0) + sessionXp} XP</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
            <span className="text-sm">🔥</span>
            <span className="font-semibold">{profile?.current_streak || 0} day streak</span>
          </div>
        </div>
      </motion.div>

      {/* Timer Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={cn("relative z-50", tunnelVision && "relative z-50")}
      >
        <GlassCard className="p-8 text-center" variant={isRunning ? "glow" : "default"} glowColor="primary">
          <div className="mb-8">
            <motion.div
              className="text-7xl lg:text-8xl font-display font-bold text-foreground tabular-nums"
              animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
              transition={{ repeat: isRunning ? Infinity : 0, duration: 2 }}
            >
              {formatTime(time)}
            </motion.div>
            <p className="text-muted-foreground mt-2">
              {isRunning ? "Stay focused. Tab switching will stop the timer." : "Ready for deep work?"}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleStopAttempt}
              className={cn(
                "w-16 h-16 rounded-full",
                isRunning
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={resetTimer}
              className="w-16 h-16 rounded-full border-white/20"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          {/* Anti-cheat status */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            {isVisible ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-success">Anti-cheat active • Tab monitored</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-destructive">Focus broken • Return to resume</span>
              </>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Controls */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Toggle Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Focus Mode
              </h3>
              {monkMode && (
                <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-medium animate-pulse">
                  MONK MODE ACTIVE
                </span>
              )}
            </div>

            {/* Master Monk Mode Switch */}
            <div className="p-4 glass-strong rounded-xl border border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                    <Zap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Monk Mode</p>
                    <p className="text-xs text-muted-foreground">Tunnel Vision + Bionic + Shield</p>
                  </div>
                </div>
                <Switch
                  checked={monkMode}
                  onCheckedChange={toggleMonkMode}
                  disabled={isRunning}
                />
              </div>
            </div>

            {/* Feature Status Indicators */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <EyeOff className={cn("w-4 h-4", tunnelVision ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm", tunnelVision ? "text-foreground font-medium" : "text-muted-foreground")}>Tunnel Vision</span>
                </div>
                <span className="text-xs text-muted-foreground">{tunnelVision ? "On" : "Off"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Type className={cn("w-4 h-4", bionicReading ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm", bionicReading ? "text-foreground font-medium" : "text-muted-foreground")}>Bionic Reading</span>
                </div>
                <span className="text-xs text-muted-foreground">{bionicReading ? "On" : "Off"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <BellOff className={cn("w-4 h-4", monkMode ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm", monkMode ? "text-foreground font-medium" : "text-muted-foreground")}>Notification Shield</span>
                </div>
                {monkMode ? (
                  <span className="text-xs px-2 py-0.5 bg-destructive/20 text-destructive rounded-full">
                    {blockedNotifs} Blocked
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Off</span>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Reading Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 h-full relative overflow-hidden">
            {monkMode && (
              <div className="absolute top-4 right-4 z-10">
                <span className="text-xs font-mono text-muted-foreground opacity-50">
                  RELIEVING PREFRONTAL CORTEX...
                </span>
              </div>
            )}
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Sample Learning Material
            </h3>
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {bionicReading ? toBionicText(sampleText) : sampleText}
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
