import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllPlayers, useGetAllDuels } from '@/hooks/useQueries';
import { Users, UserX, Swords, Trophy, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getStats } from '@/utils/stats';

export default function DashboardPage() {
  const { data: players = [], isLoading: playersLoading } = useGetAllPlayers();
  const { data: duels = [], isLoading: duelsLoading } = useGetAllDuels();

  const isLoading = playersLoading || duelsLoading;

  const stats = getStats(players, duels);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold pixel-text mb-2">Statistics Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of all Duel SMP activity and player statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Players */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold pixel-text">{stats.activePlayers}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Players with hearts remaining
            </p>
          </CardContent>
        </Card>

        {/* Eliminated Players */}
        <Card className="border-2 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eliminated</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold pixel-text text-destructive">
                {stats.eliminatedPlayers}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Players at 0 hearts
            </p>
          </CardContent>
        </Card>

        {/* Total Matches */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Swords className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold pixel-text">{stats.totalMatches}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Completed duels
            </p>
          </CardContent>
        </Card>

        {/* Current Leader */}
        <Card className="border-2 border-primary/20 md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Leader</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : stats.currentLeader ? (
              <>
                <div className="text-2xl font-bold pixel-text truncate">
                  {stats.currentLeader.displayName}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.currentLeader.currentHearts} hearts (most hearts, tie-break by wins)
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No players yet</div>
            )}
          </CardContent>
        </Card>

        {/* Most Wins */}
        <Card className="border-2 border-primary/20 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Wins</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : stats.mostWins ? (
              <>
                <div className="text-2xl font-bold pixel-text truncate">
                  {stats.mostWins.displayName}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.mostWins.wins} wins (tie-break by current hearts, then by name)
                </p>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No players yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
