import { createRoute, Navigate } from '@tanstack/react-router';
import { StadiumDetail } from '../stadiums/StadiumDetail';
import { useAuth } from '../context/AuthContext';
import { Route as RootRoute } from './__root';

export const Route = createRoute({
  path: '/stadiums/$id',
  getParentRoute: () => RootRoute,
  component: StadiumDetailRoute,
});

function StadiumDetailRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return <StadiumDetail />;
}
