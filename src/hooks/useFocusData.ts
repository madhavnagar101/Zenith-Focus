import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Types
export interface Profile {
    total_xp: number;
    current_streak: number;
}

export interface FocusSession {
    id: string;
    start_time: string;
    duration_seconds: number;
    xp_earned: number;
    status: 'completed' | 'interrupted' | 'abandoned';
}

export interface DailyStats {
    date: string;
    passive_minutes: number;
    active_minutes: number;
}

// Keys
const KEYS = {
    PROFILE: "focus-flow-profile",
    SESSIONS: "focus-flow-sessions",
    STATS: "focus-flow-daily-stats", // Stored as a map { "YYYY-MM-DD": { ... } }
};

export function useFocusData() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // 1. Fetch Profile
    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const stored = localStorage.getItem(KEYS.PROFILE);
            if (stored) return JSON.parse(stored) as Profile;
            // Default
            return { total_xp: 0, current_streak: 0 };
        },
    });

    // 2. Fetch Daily Stats (Today)
    const { data: dailyStats } = useQuery({
        queryKey: ["dailyStats"],
        queryFn: async () => {
            const today = new Date().toISOString().split("T")[0];
            const allStatsStr = localStorage.getItem(KEYS.STATS);
            const allStats = allStatsStr ? JSON.parse(allStatsStr) : {};
            return allStats[today] || { date: today, passive_minutes: 0, active_minutes: 0 };
        },
    });

    // 3. Fetch Weekly Stats (Last 7 Days)
    const { data: weeklyStats } = useQuery({
        queryKey: ["weeklyStats", dailyStats], // Refetch when daily stats change
        queryFn: async () => {
            const allStatsStr = localStorage.getItem(KEYS.STATS);
            const allStats = allStatsStr ? JSON.parse(allStatsStr) : {};

            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const last7Days = [];

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split("T")[0];
                const dayName = days[d.getDay()];

                const stat = allStats[dateStr] || { passive_minutes: 0, active_minutes: 0 };

                // Mock passive data for history to make the demo look alive
                const isToday = i === 0;
                const mockPassive = isToday ? 0 : Math.floor(Math.random() * 300) + 60; // 1-6 hours
                const passive = stat.passive_minutes || mockPassive;

                // Convert to hours for the chart
                last7Days.push({
                    day: dayName,
                    passive: Number((passive / 60).toFixed(1)),
                    active: Number((stat.active_minutes / 60).toFixed(1))
                });
            }
            return last7Days;
        }
    });

    // 3. Mutation to Log Session
    const logSessionMutation = useMutation({
        mutationFn: async ({
            durationSeconds,
            xpEarned,
            status
        }: {
            durationSeconds: number,
            xpEarned: number,
            status: 'completed' | 'interrupted' | 'abandoned'
        }) => {
            // A. Save Session
            const newSession: FocusSession = {
                id: crypto.randomUUID(),
                start_time: new Date().toISOString(),
                duration_seconds: durationSeconds,
                xp_earned: xpEarned,
                status
            };
            const sessions = JSON.parse(localStorage.getItem(KEYS.SESSIONS) || "[]");
            sessions.push(newSession);
            localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));

            // B. Update Profile XP
            const currentProfile = JSON.parse(localStorage.getItem(KEYS.PROFILE) || JSON.stringify({ total_xp: 0, current_streak: 0 }));
            currentProfile.total_xp += xpEarned;
            // Simple streak logic: increment (real logic would involve dates)
            currentProfile.current_streak += 1;
            localStorage.setItem(KEYS.PROFILE, JSON.stringify(currentProfile));

            // C. Update Daily Stats (Active Minutes)
            const today = new Date().toISOString().split("T")[0];
            const allStats = JSON.parse(localStorage.getItem(KEYS.STATS) || "{}");
            if (!allStats[today]) allStats[today] = { date: today, passive_minutes: 0, active_minutes: 0 };

            // Add duration in minutes
            allStats[today].active_minutes += Math.round(durationSeconds / 60);
            localStorage.setItem(KEYS.STATS, JSON.stringify(allStats));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            queryClient.invalidateQueries({ queryKey: ["dailyStats"] });
            toast.success("Session saved locally!");
        },
        onError: (err: any) => {
            toast.error("Failed to save: " + err.message);
        }
    });

    return {
        profile,
        dailyStats,
        weeklyStats,
        logSession: logSessionMutation.mutateAsync,
    };
}
