import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Player, Duel, PlayerId, MatchId, Hearts, BetMode } from '@/backend';

// Query Keys
export const queryKeys = {
  players: ['players'] as const,
  duels: ['duels'] as const,
  player: (id: PlayerId) => ['player', id] as const,
  duel: (id: MatchId) => ['duel', id] as const,
};

// Players Queries
export function useGetAllPlayers() {
  const { actor, isFetching } = useActor();

  return useQuery<Player[]>({
    queryKey: queryKeys.players,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPlayer(id: PlayerId) {
  const { actor, isFetching } = useActor();

  return useQuery<Player>({
    queryKey: queryKeys.player(id),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getPlayer(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, displayName }: { id: PlayerId; displayName: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addPlayer(id, displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.players });
    },
  });
}

export function useRemovePlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: PlayerId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removePlayer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.players });
      queryClient.invalidateQueries({ queryKey: queryKeys.duels });
    },
  });
}

// Duels Queries
export function useGetAllDuels() {
  const { actor, isFetching } = useActor();

  return useQuery<Duel[]>({
    queryKey: queryKeys.duels,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDuels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDuel(id: MatchId) {
  const { actor, isFetching } = useActor();

  return useQuery<Duel>({
    queryKey: queryKeys.duel(id),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getMatchById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateDuel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      player1,
      player2,
      p1Bet,
      p2Bet,
      betMode,
    }: {
      player1: PlayerId;
      player2: PlayerId;
      p1Bet: Hearts;
      p2Bet: Hearts;
      betMode: BetMode;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createDuel(player1, player2, p1Bet, p2Bet, betMode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.duels });
    },
  });
}

export function useGenerateRandomDuel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.generateRandomDuel();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.duels });
    },
  });
}

export function useCompleteMatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, winnerId }: { matchId: MatchId; winnerId: PlayerId }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.completeMatch(matchId, winnerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.duels });
      queryClient.invalidateQueries({ queryKey: queryKeys.players });
    },
  });
}
