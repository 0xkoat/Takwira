import { createRoute, Navigate } from '@tanstack/react-router';
import { UserProfile } from '../profile/UserProfile';
import { useAuth } from '../context/AuthContext';
import { Route as RootRoute } from './__root';

export const Route = createRoute({
  path: '/profile',
  getParentRoute: () => RootRoute,
  component: ProfileRoute,
});

function ProfileRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return <UserProfile />;
}
