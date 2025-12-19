import { useState } from "react";
import { motion } from "framer-motion";
import {
  BellOff,
  MessageSquare,
  Mail,
  Instagram,
  MessageCircle,
  Calendar,
  Plus,
  Check,
  X,
  Clock,
  Filter,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  app: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  preview: string;
  time: string;
  urgent: boolean;
  replyNote?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    app: "Instagram",
    icon: Instagram,
    title: "sarah_design",
    preview: "Loved your latest post! Can you send me the...",
    time: "2m ago",
    urgent: false,
  },
  {
    id: "2",
    app: "Messages",
    icon: MessageSquare,
    title: "Mom",
    preview: "Don't forget dinner tonight at 7pm!",
    time: "15m ago",
    urgent: true,
  },
  {
    id: "3",
    app: "Email",
    icon: Mail,
    title: "Project Update - Q4 Report",
    preview: "Hi team, please review the attached docum...",
    time: "32m ago",
    urgent: false,
  },
  {
    id: "4",
    app: "WhatsApp",
    icon: MessageCircle,
    title: "Work Group",
    preview: "Meeting rescheduled to 3pm. See you all...",
    time: "1h ago",
    urgent: true,
  },
  {
    id: "5",
    app: "Calendar",
    icon: Calendar,
    title: "Reminder",
    preview: "Team standup in 30 minutes",
    time: "1h ago",
    urgent: false,
  },
];

export default function NotificationJail() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [replyNote, setReplyNote] = useState("");
  const [filter, setFilter] = useState<"all" | "urgent">("all");

  const filteredNotifications = filter === "urgent"
    ? notifications.filter(n => n.urgent)
    : notifications;

  const handleAddNote = () => {
    if (!selectedNotif || !replyNote.trim()) return;
    
    setNotifications(prev => 
      prev.map(n => 
        n.id === selectedNotif.id 
          ? { ...n, replyNote: replyNote.trim() } 
          : n
      )
    );
    setReplyNote("");
    setSelectedNotif(null);
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const pendingCount = notifications.filter(n => !n.replyNote).length;
  const notedCount = notifications.filter(n => n.replyNote).length;

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
            Notification Jail
          </h1>
          <p className="text-muted-foreground mt-1">
            Batch process notifications without losing focus
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-sm">{pendingCount} pending</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
            <Check className="w-4 h-4 text-success" />
            <span className="text-sm">{notedCount} noted</span>
          </div>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-4 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <BellOff className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Batching Mode Active</h3>
              <p className="text-sm text-muted-foreground">
                Notifications are blurred to reduce dopamine triggers. Add reply notes to clear mental load without breaking focus.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full",
            filter === "all" ? "bg-primary text-primary-foreground" : "glass"
          )}
        >
          <Filter className="w-4 h-4 mr-2" />
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilter("urgent")}
          className={cn(
            "rounded-full",
            filter === "urgent" ? "bg-accent text-accent-foreground" : "glass"
          )}
        >
          Urgent Only
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard
              className={cn(
                "p-4 transition-all",
                notif.replyNote && "border-success/30 bg-success/5"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  notif.urgent ? "bg-accent/20" : "bg-white/5"
                )}>
                  <notif.icon className={cn(
                    "w-6 h-6",
                    notif.urgent ? "text-accent" : "text-muted-foreground"
                  )} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{notif.app}</span>
                    {notif.urgent && (
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full">
                        Urgent
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">{notif.time}</span>
                  </div>
                  <h4 className="font-medium text-foreground">{notif.title}</h4>
                  <p className={cn(
                    "text-sm text-muted-foreground truncate",
                    !notif.replyNote && "blur-sm hover:blur-none transition-all cursor-pointer"
                  )}>
                    {notif.preview}
                  </p>

                  {notif.replyNote && (
                    <div className="mt-3 p-3 glass-strong rounded-lg">
                      <p className="text-sm text-foreground flex items-center gap-2">
                        <Check className="w-4 h-4 text-success" />
                        <span className="font-medium">Reply note:</span>
                        {notif.replyNote}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!notif.replyNote && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedNotif(notif)}
                      className="glass hover:bg-white/10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismiss(notif.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}

        {filteredNotifications.length === 0 && (
          <GlassCard className="p-12 text-center">
            <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-2">
              All Clear!
            </h3>
            <p className="text-muted-foreground">
              No notifications to process. Enjoy your focus time.
            </p>
          </GlassCard>
        )}
      </div>

      {/* Reply Note Modal */}
      {selectedNotif && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedNotif(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="max-w-md p-6 w-full">
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                Quick Reply Note
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a note to remind yourself what action to take later.
              </p>
              
              <div className="p-3 glass-strong rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <selectedNotif.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{selectedNotif.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedNotif.preview}</p>
              </div>

              <Input
                placeholder="e.g., Reply later: Send file to Sarah"
                value={replyNote}
                onChange={(e) => setReplyNote(e.target.value)}
                className="mb-4 bg-white/5 border-white/10"
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedNotif(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddNote}
                  disabled={!replyNote.trim()}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Add Note
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
