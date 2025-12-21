import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  ChevronRight,
  Clock,
  BookOpen,
  Star,
  CheckCircle2,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  thumbnail: string;
  category: string;
  youtubeId: string;
}

const videos: Video[] = [
  {
    id: "1",
    title: "The Magic of Patience",
    description: "Learn why waiting and observing leads to deeper understanding",
    duration: "12:34",
    progress: 75,
    thumbnail: "🌱",
    category: "Mindfulness",
    youtubeId: "W7k75r0e0hE", // Visuals
  },
  {
    id: "2",
    title: "Building Castles One Block at a Time",
    description: "A story about perseverance and step-by-step growth",
    duration: "15:20",
    progress: 30,
    thumbnail: "🏰",
    category: "Growth",
    youtubeId: "L_WDg9gP-xw", // Kurzgesagt
  },
  {
    id: "3",
    title: "The Wise Owl's Focus",
    description: "How staying calm helps you see clearly",
    duration: "10:45",
    progress: 0,
    thumbnail: "🦉",
    category: "Focus",
    youtubeId: "mMS47DuyVd0", // Pomodoro
  },
  {
    id: "4",
    title: "The Curious Explorer",
    description: "Discover the joy of learning one thing at a time",
    duration: "18:00",
    progress: 100,
    thumbnail: "🧭",
    category: "Curiosity",
    youtubeId: "VS_v2Sg6r_c", // Veritasium
  },
  {
    id: "5",
    title: "Digital Minimalism",
    description: "Reclaiming your time in a distracted world",
    duration: "14:10",
    progress: 0,
    thumbnail: "📱",
    category: "Focus",
    youtubeId: "3E7hkPZ-HTk", // Cal Newport
  },
  {
    id: "6",
    title: "The Art of Doing Nothing",
    description: "Why downtime is essential for creativity",
    duration: "09:30",
    progress: 10,
    thumbnail: "🌅",
    category: "Mindfulness",
    youtubeId: "1-SJGQ2HLp8",
  },
  {
    id: "7",
    title: "Deep Work Basics",
    description: "Mastering the skill of intense focus",
    duration: "22:15",
    progress: 55,
    thumbnail: "⚡",
    category: "Growth",
    youtubeId: "4TpyGvJpA6k",
  },
  {
    id: "8",
    title: "Philosophy of Boredom",
    description: "How boredom can trigger your best ideas",
    duration: "11:00",
    progress: 0,
    thumbnail: "🤔",
    category: "Curiosity",
    youtubeId: "LKPwKxD6WbU",
  },
  {
    id: "9",
    title: "Nature's Rhythm",
    description: "Syncing your biological clock for better energy",
    duration: "16:45",
    progress: 0,
    thumbnail: "🍃",
    category: "Mindfulness",
    youtubeId: "BHACKCNDMW8", // Nature
  },
  {
    id: "10",
    title: "Neuroplasticity 101",
    description: "How to physically rewire your brain",
    duration: "25:00",
    progress: 0,
    thumbnail: "🧠",
    category: "Growth",
    youtubeId: "ELpfYCZa87g",
  },
];

const categories = ["All", "Mindfulness", "Growth", "Focus", "Curiosity"];

export default function FocusTube() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [watchTime, setWatchTime] = useState(0);

  const filteredVideos = selectedCategory === "All"
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    setIsPlaying(true);
    setWatchTime(0);
    setShowQuestion(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground flex items-center gap-3">
            Focus Tube
            <Star className="w-6 h-6 text-accent fill-accent" />
          </h1>
          <p className="text-muted-foreground mt-1">
            Slow-paced growth videos for building focus stamina
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm">No infinite scroll • Linear learning only</span>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "rounded-full border border-transparent",
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "glass hover:bg-white/10"
            )}
          >
            {category}
          </Button>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Player Area */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="aspect-video flex items-center justify-center relative overflow-hidden bg-black/40 p-0">
              {currentVideo ? (
                <>
                  {isPlaying ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1`}
                      title={currentVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 z-10"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <span className="text-8xl mb-4">{currentVideo.thumbnail}</span>
                      <h3 className="text-xl font-display font-semibold text-foreground text-center px-4">
                        {currentVideo.title}
                      </h3>
                    </div>
                  )}

                  {/* Play/Pause overlay - Only show when NOT playing */}
                  {!isPlaying && (
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center bg-background/50 hover:bg-background/40 transition-colors z-20"
                    >
                      <Play className="w-16 h-16 text-foreground ml-2" />
                    </button>
                  )}

                  {/* Close Button when playing */}
                  {isPlaying && (
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full z-30 transition-colors"
                      title="Close Video"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center p-6">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a video to begin learning</p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Comprehension Question */}
          {showQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-6 border-accent/30">
                <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    💭
                  </span>
                  Comprehension Check
                </h3>
                <p className="text-foreground mb-4">
                  What did the character just learn in the video?
                </p>
                <div className="space-y-2">
                  {["The importance of patience", "How to be faster", "Nothing specific", "I wasn't watching"].map((option, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setShowQuestion(false);
                        setIsPlaying(true);
                      }}
                      className="w-full p-3 glass rounded-xl text-left hover:bg-white/10 transition-colors flex items-center gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>

        {/* Video List */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-lg text-foreground px-1">
            Up Next
          </h3>
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <GlassCard
                className={cn(
                  "p-4 cursor-pointer hover:bg-white/10 transition-all",
                  currentVideo?.id === video.id && "border-primary/50 bg-primary/10"
                )}
                onClick={() => handleVideoSelect(video)}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl glass-strong flex items-center justify-center text-3xl flex-shrink-0">
                    {video.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-foreground text-sm line-clamp-2">
                        {video.title}
                      </h4>
                      {video.progress === 100 && (
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{video.duration}</p>
                    {video.progress > 0 && video.progress < 100 && (
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${video.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 self-center" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
