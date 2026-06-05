import { createBrowserHistory, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const history = createBrowserHistory({ window });

export const router = createRouter({
  routeTree,
  history,
  defaultPreload: 'intent',
});

