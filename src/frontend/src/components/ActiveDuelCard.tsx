import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Swords, Eye, EyeOff } from 'lucide-react';
import type { Duel } from '@/backend';
import { BetMode, MatchStatus } from '@/backend';
import MatchCompletionControls from './MatchCompletionControls';
import { useGetAllPlayers } from '@/hooks/useQueries';

interface ActiveDuelCardProps {
  duel: Duel;
}

export default function ActiveDuelCard({ duel }: ActiveDuelCardProps) {
  const { data: players = [] } = useGetAllPlayers();

  const player1 = players.find((p) => p.id === duel.player1);
  const player2 = players.find((p) => p.id === duel.player2);

  const isBlind = duel.betMode === BetMode.blind;
  const isPending = duel.status === MatchStatus.pending;
  const showBets = !isBlind || !isPending;

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Swords className="w-5 h-5" />
            Active Duel
          </span>
          <Badge variant={isBlind ? 'secondary' : 'default'}>
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Player 1 */}
          <div className="p-4 rounded-lg border-2 border-primary/20 bg-card">
            <div className="text-sm text-muted-foreground mb-1">Player 1</div>
            <div className="text-xl font-bold pixel-text mb-2">
              {player1?.displayName || duel.player1}
            </div>
            {showBets && (
              <div className="text-sm">
                Bet: <span className="font-bold">{Number(duel.p1Bet)} ❤️</span>
              </div>
            )}
            {!showBets && (
              <div className="text-sm text-muted-foreground">Bet: Hidden</div>
            )}
          </div>

          {/* Player 2 */}
          <div className="p-4 rounded-lg border-2 border-primary/20 bg-card">
            <div className="text-sm text-muted-foreground mb-1">Player 2</div>
            <div className="text-xl font-bold pixel-text mb-2">
              {player2?.displayName || duel.player2}
            </div>
            {showBets && (
              <div className="text-sm">
                Bet: <span className="font-bold">{Number(duel.p2Bet)} ❤️</span>
              </div>
            )}
            {!showBets && (
              <div className="text-sm text-muted-foreground">Bet: Hidden</div>
            )}
          </div>
        </div>

        {isPending && (
          <MatchCompletionControls 
            duel={duel}
            player1Name={player1?.displayName || duel.player1}
            player2Name={player2?.displayName || duel.player2}
          />
        )}

        {!isPending && duel.winner && (
          <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary text-center">
            <div className="text-sm text-muted-foreground mb-1">Winner</div>
            <div className="text-2xl font-bold pixel-text">
              {duel.winner === duel.player1 
                ? (player1?.displayName || duel.player1)
                : (player2?.displayName || duel.player2)
              }
            </div>
            <div className="text-sm mt-2">
              Hearts transferred: <span className="font-bold">{Number(duel.heartsTransferred)} ❤️</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
