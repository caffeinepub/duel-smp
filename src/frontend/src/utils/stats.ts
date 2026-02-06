import type { Player, Duel } from '@/backend';
import { MatchStatus } from '@/backend';

export interface Stats {
  activePlayers: number;
  eliminatedPlayers: number;
  totalMatches: number;
  currentLeader: Player | null;
  mostWins: Player | null;
}

export function getStats(players: Player[], duels: Duel[]): Stats {
  const activePlayers = players.filter((p) => !p.eliminated).length;
  const eliminatedPlayers = players.filter((p) => p.eliminated).length;
  const totalMatches = duels.filter((d) => d.status === MatchStatus.complete).length;

  // Current leader: highest current hearts, tie-break by wins, then by name
  const currentLeader = players.length > 0
    ? [...players].sort((a, b) => {
        const heartsDiff = Number(b.currentHearts) - Number(a.currentHearts);
        if (heartsDiff !== 0) return heartsDiff;
        
        const winsDiff = Number(b.wins) - Number(a.wins);
        if (winsDiff !== 0) return winsDiff;
        
        return a.displayName.localeCompare(b.displayName);
      })[0]
    : null;

  // Most wins: highest wins, tie-break by current hearts, then by name
  const mostWins = players.length > 0
    ? [...players].sort((a, b) => {
        const winsDiff = Number(b.wins) - Number(a.wins);
        if (winsDiff !== 0) return winsDiff;
        
        const heartsDiff = Number(b.currentHearts) - Number(a.currentHearts);
        if (heartsDiff !== 0) return heartsDiff;
        
        return a.displayName.localeCompare(b.displayName);
      })[0]
    : null;

  return {
    activePlayers,
    eliminatedPlayers,
    totalMatches,
    currentLeader,
    mostWins,
  };
}
