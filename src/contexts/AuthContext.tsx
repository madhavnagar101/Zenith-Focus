import { createContext, useContext, useEffect, useState } from "react";

// Mock User Types (replacing Supabase types)
export interface User {
    id: string;
    email?: string;
}

export interface Session {
    user: User;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signInWithGoogle: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const loading = false;

    useEffect(() => {
        // Auto-login as "Local User"
        const localUser = { id: "local-user-id", email: "local@user.com" };
        setUser(localUser);
        setSession({ user: localUser });
    }, []);

    const signInWithGoogle = async () => {
        console.log("Local mode: Google Sign In clicked (Mock)");
    };

    const signOut = async () => {
        console.log("Local mode: Sign Out clicked (Mock)");
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
