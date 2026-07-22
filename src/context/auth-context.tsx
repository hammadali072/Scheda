import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
    type User,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { auth, database } from "@/firebase";

export interface AuthUserProfile {
    uid: string;
    name: string;
    email: string;
    role: AuthRole;
    createdAt?: string;
    phone?: string;
    designation?: string;
    bio?: string;
}

export type AuthRole = "client" | "member" | "admin";

interface AuthContextValue {
    authUser: User | null;
    profile: AuthUserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<AuthUserProfile>;
    signup: (name: string, email: string, password: string, role: AuthRole) => Promise<AuthUserProfile>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getDashboardPath(role: AuthRole) {
    switch (role) {
        case "admin":
            return "/admin";
        case "member":
            return "/member";
        default:
            return "/client";
    }
}

async function loadProfile(uid: string): Promise<AuthUserProfile> {
    try {
        const snapshot = await get(ref(database, `users/${uid}`));
        if (snapshot.exists()) {
            const data = snapshot.val() as Record<string, unknown>;
            return {
                uid,
                name: typeof data.name === "string" ? data.name : "",
                email: typeof data.email === "string" ? data.email : "",
                role: (data.role as AuthRole) ?? "client",
                createdAt: typeof data.createdAt === "string" ? data.createdAt : undefined,
                phone: typeof data.phone === "string" ? data.phone : undefined,
                designation: typeof data.designation === "string" ? data.designation : undefined,
                bio: typeof data.bio === "string" ? data.bio : undefined,
            };
        }
    } catch (error) {
        console.warn("Unable to load user profile from Realtime Database:", error);
    }

    return {
        uid,
        name: "",
        email: "",
        role: "client",
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<AuthUserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setAuthUser(null);
                setProfile(null);
                setLoading(false);
                return;
            }

            setAuthUser(firebaseUser);
            const nextProfile = await loadProfile(firebaseUser.uid);
            setProfile(nextProfile);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const nextProfile = await loadProfile(user.uid);
        setAuthUser(user);
        setProfile(nextProfile);
        return nextProfile;
    };

    const signup = async (name: string, email: string, password: string, role: AuthRole) => {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: name });

        const nextProfile: AuthUserProfile = {
            uid: user.uid,
            name,
            email,
            role,
            createdAt: new Date().toISOString(),
        };

        try {
            await set(ref(database, `users/${user.uid}`), nextProfile);
        } catch (error) {
            console.warn("Unable to save user profile to Realtime Database:", error);
        }

        setAuthUser(user);
        setProfile(nextProfile);
        return nextProfile;
    };

    const logout = async () => {
        await firebaseSignOut(auth);
        setAuthUser(null);
        setProfile(null);
    };

    const value = useMemo(
        () => ({ authUser, profile, loading, login, signup, logout }),
        [authUser, profile, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { getDashboardPath };
