import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import PlayersPage from './pages/PlayersPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DuelPage from './pages/DuelPage';
import HistoryPage from './pages/HistoryPage';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const playersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/players',
  component: PlayersPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const duelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/duel',
  component: DuelPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: HistoryPage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  playersRoute,
  leaderboardRoute,
  duelRoute,
  historyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
