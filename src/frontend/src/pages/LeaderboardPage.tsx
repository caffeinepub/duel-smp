import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllPlayers } from '@/hooks/useQueries';
import { Trophy } from 'lucide-react';
import PlayerList from '@/components/PlayerList';
import { sortLeaderboard } from '@/utils/leaderboard';

export default function LeaderboardPage() {
  const { data: players = [], isLoading } = useGetAllPlayers();

  const sortedPlayers = sortLeaderboard(players);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold pixel-text mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-primary" />
          Leaderboard
        </h2>
        <p className="text-muted-foreground">
          Players ranked by current hearts (tie-break: wins, then display name)
        </p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <PlayerList 
            players={sortedPlayers} 
            isLoading={isLoading}
            showRank
          />
        </CardContent>
      </Card>
    </div>
  );
}
