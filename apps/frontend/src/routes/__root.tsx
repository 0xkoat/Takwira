import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AuthProvider } from "../context/AuthContext";

function RootComponent() {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
});

