import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Eye, EyeOff } from 'lucide-react';
import type { Duel } from '@/backend';
import { BetMode } from '@/backend';
import { useGetAllPlayers } from '@/hooks/useQueries';

interface MatchHistoryListProps {
  duels: Duel[];
  isLoading?: boolean;
}

export default function MatchHistoryList({ duels, isLoading }: MatchHistoryListProps) {
  const { data: players = [] } = useGetAllPlayers();

  const getPlayerName = (id: string) => {
    const player = players.find((p) => p.id === id);
    return player?.displayName || id;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (duels.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No completed matches yet. Create a duel to get started!
      </div>
    );
  }

  return (
    <div className="rounded-md border-2 border-primary/20 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Match</TableHead>
            <TableHead>Players</TableHead>
            <TableHead className="text-center">Bets</TableHead>
            <TableHead className="text-center">Mode</TableHead>
            <TableHead className="text-center">Winner</TableHead>
            <TableHead className="text-center">Hearts Won</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {duels.map((duel) => {
            const player1Name = getPlayerName(duel.player1);
            const player2Name = getPlayerName(duel.player2);
            const winnerName = duel.winner ? getPlayerName(duel.winner) : 'Unknown';
            const isBlind = duel.betMode === BetMode.blind;

            return (
              <TableRow key={duel.id}>
                <TableCell className="font-mono text-sm">#{duel.id}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{player1Name}</div>
                    <div className="text-xs text-muted-foreground">vs</div>
                    <div className="text-sm">{player2Name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="space-y-1">
                    <div className="text-sm">{Number(duel.p1Bet)} ❤️</div>
                    <div className="text-sm">{Number(duel.p2Bet)} ❤️</div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={isBlind ? 'secondary' : 'default'} className="text-xs">
                    {isBlind ? (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Blind
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Agreed
                      </>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="font-medium">{winnerName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-bold pixel-text text-lg">
                    {Number(duel.heartsTransferred)} ❤️
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
