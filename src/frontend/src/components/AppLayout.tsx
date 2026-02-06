import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Swords, Users, Trophy, Scroll, LayoutDashboard } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGlobalInitAndQueryErrors } from '@/hooks/useGlobalInitAndQueryErrors';
import GlobalErrorBanner from './GlobalErrorBanner';

export default function AppLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const errorMessage = useGlobalInitAndQueryErrors();

  const getActiveTab = () => {
    if (currentPath === '/') return 'dashboard';
    if (currentPath === '/players') return 'players';
    if (currentPath === '/leaderboard') return 'leaderboard';
    if (currentPath === '/duel') return 'duel';
    if (currentPath === '/history') return 'history';
    return 'dashboard';
  };

  const handleTabChange = (value: string) => {
    const routes: Record<string, string> = {
      dashboard: '/',
      players: '/players',
      leaderboard: '/leaderboard',
      duel: '/duel',
      history: '/history',
    };
    navigate({ to: routes[value] });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Background */}
      <div 
        className="banner-bg border-b-4 border-primary"
        style={{
          backgroundImage: 'url(/assets/generated/duel-smp-banner.dim_1600x400.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src="/assets/generated/duel-smp-logo.dim_512x512.png" 
              alt="Duel SMP Logo" 
              className="w-16 h-16 pixelated"
            />
            <div>
              <h1 className="text-4xl font-bold text-white pixel-text drop-shadow-brutal">
                DUEL SMP
              </h1>
              <p className="text-white/90 text-sm drop-shadow-md">
                Battle Arena Management System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto bg-card/90 backdrop-blur-sm border-2 border-primary">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="players" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Players</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger value="duel" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Swords className="w-4 h-4" />
                <span className="hidden sm:inline">Duel</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Scroll className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Global Error Banner */}
        {errorMessage && <GlobalErrorBanner message={errorMessage} />}
        
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-primary bg-card mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with ❤️ using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
