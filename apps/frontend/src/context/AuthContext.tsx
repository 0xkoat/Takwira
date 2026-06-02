import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:4000/api/profile/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Invalid session');
            })
            .then(data => setUser(data))
            .catch(() => {
                localStorage.removeItem('token');
            })
            .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (loggedUser: UserData) => {
        setUser(loggedUser);
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (updatedUser: UserData) => {
        setUser(updatedUser);
    };

    if (loading) return null;

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

