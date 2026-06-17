import { createRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { Login } from "../login/Login";
import { useAuth } from "../context/AuthContext";
import { Route as RootRoute } from './__root';

export const Route = createRoute({
    path: '/',
    getParentRoute: () => RootRoute,
    component: LoginPage,
});

function LoginPage() {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/stadiums" />;
    }

    return (
        <Login
            onLoginSuccess={(loggedUser: any, token: string) => {
                if (loggedUser && token) {
                    login(loggedUser, token);
                }
                navigate({ to: '/stadiums' });
            }}
        />
    );
}


