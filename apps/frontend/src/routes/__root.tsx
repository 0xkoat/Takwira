import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AuthProvider } from "../context/AuthContext";
import { Header } from "../Header";

function RootComponent() {
    return (
        <AuthProvider>
            <Header />
            <Outlet />
        </AuthProvider>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
});

