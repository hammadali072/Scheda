import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { get, ref, update } from "firebase/database";
import { auth, database } from "@/firebase";

export interface UserProfileData {
    uid: string;
    name: string;
    email: string;
    role: "client" | "member" | "admin";
    createdAt?: string;
    phone?: string;
    designation?: string;
    bio?: string;
}

export interface ReauthRequiredError extends Error {
    code: "auth/requires-recent-login";
}

export const isReauthRequiredError = (error: unknown): error is ReauthRequiredError => {
    return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "auth/requires-recent-login";
};

export async function getUserProfile(uid: string): Promise<UserProfileData> {
    const snapshot = await get(ref(database, `users/${uid}`));
    if (!snapshot.exists()) {
        return {
            uid,
            name: "",
            email: "",
            role: "client",
        };
    }

    const data = snapshot.val() as Record<string, unknown>;
    return {
        uid,
        name: typeof data.name === "string" ? data.name : "",
        email: typeof data.email === "string" ? data.email : "",
        role: (data.role as UserProfileData["role"]) ?? "client",
        createdAt: typeof data.createdAt === "string" ? data.createdAt : undefined,
        phone: typeof data.phone === "string" ? data.phone : undefined,
        designation: typeof data.designation === "string" ? data.designation : undefined,
        bio: typeof data.bio === "string" ? data.bio : undefined,
    };
}

export async function updateUserProfile(uid: string, partialData: Partial<UserProfileData>): Promise<void> {
    await update(ref(database, `users/${uid}`), partialData);
}

export async function updateUserPassword(newPassword: string, currentPassword?: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
        throw new Error("No authenticated user found.");
    }

    if (currentPassword) {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
    }

    await updatePassword(currentUser, newPassword);
}
