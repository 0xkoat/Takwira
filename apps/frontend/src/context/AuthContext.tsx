import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from '@tanstack/react-router';
import { UserData } from '@takwira/shared';

interface AuthContextType {
    user: UserData | null;
    login: (user: UserData, token: string) => void;
    logout: (redirect?: boolean) => void;
    updateUser: (user: UserData, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = (redirect = true) => {
        localStorage.removeItem('token');
        setUser(null);
        if (redirect) {
            navigate({ to: '/' });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Invalid session');
            })
            .then(data => setUser(data))
            .catch(() => {
                logout();
            })
            .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (loggedUser: UserData, token: string) => {
        localStorage.setItem('token', token);
        setUser(loggedUser);
    };

    const updateUser = (updatedUser: UserData, token: string) => {
        localStorage.setItem('token', token);
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
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
