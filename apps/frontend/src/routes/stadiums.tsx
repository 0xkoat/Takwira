import { createRoute, Navigate } from "@tanstack/react-router";
import { StadiumsPage } from "../stadiums/StadiumsPage";
import { useAuth } from "../context/AuthContext";
import { Route as RootRoute } from './__root';

export const Route = createRoute({
    path: '/stadiums',
    getParentRoute: () => RootRoute,
    component: StadiumsRoute,
});

function StadiumsRoute() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" />;
    }

    return <StadiumsPage />;
}
