import { createContext, useContext, useState, ReactNode } from "react";
import { UserData } from '@takwira/shared';

interface AuthContextType {
    user: UserData | null;
    login: (user: UserData) => void;
    logout: () => void;
    updateUser: (user: UserData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const login = (loggedUser: UserData) => {
        setUser(loggedUser);
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (updatedUser: UserData) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('error');
    }

    return context;
}

