import type { Player } from '@/backend';

export function sortLeaderboard(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    // Primary: current hearts (descending)
    const heartsDiff = Number(b.currentHearts) - Number(a.currentHearts);
    if (heartsDiff !== 0) return heartsDiff;

    // Tie-break 1: wins (descending)
    const winsDiff = Number(b.wins) - Number(a.wins);
    if (winsDiff !== 0) return winsDiff;

    // Tie-break 2: display name (ascending, alphabetical)
    return a.displayName.localeCompare(b.displayName);
  });
}
