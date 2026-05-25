import { createBrowserHistory, Router } from '@tanstack/react-router';
import { Route as RootRoute } from './routes/__root';
import { Route as IndexRoute } from './routes/index';
import { Route as SignupRoute } from './routes/signup';
import { Route as StadiumsRoute } from './routes/stadiums';
import { Route as ProfileRoute } from './routes/profile';
import { Route as PostStadiumRoute } from './routes/post-stadiums';

const history = createBrowserHistory({ window });

const routeTree = RootRoute.addChildren([
  IndexRoute,
  SignupRoute,
  StadiumsRoute,
  ProfileRoute,
  PostStadiumRoute,
]);

export const router = new Router({
  routeTree,
  history,
  defaultPreload: 'intent',
});
