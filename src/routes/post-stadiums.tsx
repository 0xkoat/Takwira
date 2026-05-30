import { createRoute, Navigate } from '@tanstack/react-router';
import PostStadium from '../stadiums/PostStadium';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/UserData';
import { Route as RootRoute } from './__root';

export const Route = createRoute({
  path: '/post-stadium',
  getParentRoute: () => RootRoute,
  component: PostStadiumRoute,
});

function PostStadiumRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role !== UserRole.StadiumOwner) {
    return <Navigate to="/stadiums" />;
  }

  return <PostStadium />;
}