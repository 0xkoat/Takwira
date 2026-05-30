import { createRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { SignUp } from "../login/Signup";
import { useAuth } from "../context/AuthContext";
import { Route as RootRoute } from './__root';

export const Route = createRoute({
    path: '/signup',
    getParentRoute: () => RootRoute,
    component: SignupPage,
});

function SignupPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/stadiums" />;
    }

    return (
        <SignUp
            onSignUpSuccess={() => {
                navigate({ to: '/' });
            }}
        />
    );
}
