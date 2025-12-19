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
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes
  const [tunnelVision, setTunnelVision] = useState(false);
  const [bionicReading, setBionicReading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showPenalty, setShowPenalty] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [xp, setXp] = useState(150);
  const [streak, setStreak] = useState(3);

  // Anti-cheat: Detect tab visibility
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isRunning) {
      setIsRunning(false);
      setIsVisible(false);
      setShowPenalty(true);
      setXp((prev) => Math.max(0, prev - 25));
    } else {
      setIsVisible(true);
    }
  }, [isRunning]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          // Every 15 mins (900s), trigger quiz
          if (prev % 900 === 0 && prev !== 25 * 60) {
            setIsRunning(false);
            setShowQuiz(true);
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
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (answerIndex === quizQuestions[0].correct) {
      setXp((prev) => prev + 50);
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
      {/* Penalty Overlay */}
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

      {/* Quiz Modal */}
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
            <span className="font-semibold">{xp} XP</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
            <span className="text-sm">🔥</span>
            <span className="font-semibold">{streak} day streak</span>
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
              onClick={() => setIsRunning(!isRunning)}
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
            <h3 className="font-display font-semibold text-lg text-foreground">
              Focus Enhancements
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  {tunnelVision ? <EyeOff className="w-5 h-5 text-primary" /> : <Eye className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">Tunnel Vision</p>
                  <p className="text-sm text-muted-foreground">Dim everything except focus area</p>
                </div>
              </div>
              <Switch
                checked={tunnelVision}
                onCheckedChange={setTunnelVision}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Type className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Bionic Reading</p>
                  <p className="text-sm text-muted-foreground">Bold key letters for faster scanning</p>
                </div>
              </div>
              <Switch
                checked={bionicReading}
                onCheckedChange={setBionicReading}
              />
            </div>

            <div className="p-4 glass-strong rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Forced Active Recall</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Every 15 minutes, a quiz will pause playback to test comprehension. 
                Correct answers earn bonus XP.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Reading Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 h-full">
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
