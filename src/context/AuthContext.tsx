import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    confirmPasswordReset,
    verifyPasswordResetCode as firebaseVerifyPasswordResetCode
} from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (oobCode: string, newPassword: string) => Promise<void>;
    verifyPasswordResetCode: (oobCode: string) => Promise<string>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const register = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const login = async (email: string, password: string): Promise<User> => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    };

    const logout = async () => {
        await signOut(auth);
    };

    const forgotPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const resetPassword = async (oobCode: string, newPassword: string) => {
        await confirmPasswordReset(auth, oobCode, newPassword);
    };

    const verifyPasswordResetCode = async (oobCode: string) => {
        return await firebaseVerifyPasswordResetCode(auth, oobCode);
    };
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyPasswordResetCode
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};