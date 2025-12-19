import { motion } from "framer-motion";
import {
  Clock,
  Smartphone,
  Brain,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  XCircle,
  Wifi,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

// Mock data showing concerning screen time patterns
const weeklyScreenTime = [
  { day: "Mon", passive: 5.2, active: 1.5 },
  { day: "Tue", passive: 4.8, active: 2.1 },
  { day: "Wed", passive: 6.1, active: 0.8 },
  { day: "Thu", passive: 5.5, active: 1.2 },
  { day: "Fri", passive: 7.2, active: 0.5 },
  { day: "Sat", passive: 8.5, active: 0.3 },
  { day: "Sun", passive: 7.8, active: 0.7 },
];

const appUsage = [
  { name: "TikTok", hours: 3.5, color: "#ef4444" },
  { name: "Instagram", hours: 2.8, color: "#f97316" },
  { name: "YouTube", hours: 1.2, color: "#f59e0b" },
  { name: "Deep Work", hours: 0.8, color: "#06b6d4" },
  { name: "Learning", hours: 0.4, color: "#22c55e" },
];

const knowledgeRetention = [
  { category: "Self-recalled", value: 15 },
  { category: "Googled", value: 85 },
];

const COLORS = ["#22c55e", "#ef4444"];

export default function CommandCenter() {
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
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Your digital wellbeing at a glance
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm text-muted-foreground">
            High distraction risk detected
          </span>
        </div>
      </motion.div>

      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-4 border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">TikTok Brain Alert</h3>
              <p className="text-sm text-muted-foreground">
                Your passive browsing is 6x higher than deep work. Attention span declining.
              </p>
            </div>
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium text-sm hover:bg-destructive/90 transition-colors">
              Take Action
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Screen Time"
          value="8.7h"
          subtitle="Passive browsing"
          icon={Clock}
          trend={{ value: 23, positive: false }}
          variant="danger"
        />
        <StatCard
          title="Deep Work Today"
          value="47m"
          subtitle="Focus sessions"
          icon={Brain}
          trend={{ value: 12, positive: true }}
          variant="success"
        />
        <StatCard
          title="App Switches"
          value="127"
          subtitle="Context switches"
          icon={TrendingDown}
          trend={{ value: 8, positive: false }}
          variant="warning"
        />
        <StatCard
          title="Knowledge Retained"
          value="15%"
          subtitle="vs 85% googled"
          icon={TrendingUp}
          trend={{ value: 5, positive: false }}
          variant="danger"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Screen Time Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Passive vs Active Time
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyScreenTime}>
                  <defs>
                    <linearGradient id="passiveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(13,13,13,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="passive"
                    stroke="#ef4444"
                    fill="url(#passiveGradient)"
                    name="Passive Browsing"
                  />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stroke="#06b6d4"
                    fill="url(#activeGradient)"
                    name="Active Learning"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Passive Browsing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Active Learning</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* App Usage Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              App Usage Breakdown
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(13,13,13,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="hours" radius={[0, 8, 8, 0]}>
                    {appUsage.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Device Sync & Knowledge Retention */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Device Sync */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-40 h-40 bg-white rounded-xl p-3 flex items-center justify-center">
                  <QrCode className="w-full h-full text-background" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-display font-semibold text-xl text-foreground">
                    Device Sync
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Scan to sync your phone for second-screen monitoring
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 glass rounded-lg">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="text-sm">iPhone 15 Pro</span>
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 glass rounded-lg">
                    <Wifi className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">MacBook Pro</span>
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 glass rounded-lg opacity-50">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-sm">iPad</span>
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm text-success flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Phone locked • Second screen monitoring active
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Digital Amnesia Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6 h-full">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
              Digital Amnesia
            </h3>
            <div className="h-36 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={knowledgeRetention}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {knowledgeRetention.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  Self-recalled
                </span>
                <span className="text-foreground font-medium">15%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  Googled facts
                </span>
                <span className="text-foreground font-medium">85%</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
