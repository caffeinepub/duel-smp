import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './useQueries';
import { useActor } from './useActor';

export function useGlobalInitAndQueryErrors(): string | null {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  // Check if actor query has an error
  const actorQueryState = queryClient.getQueryState(['actor']);
  
  // Priority 1: Actor initialization failure
  if (actorQueryState?.status === 'error') {
    return 'Unable to connect to the backend service. Please check your connection and refresh the page.';
  }

  // Priority 2: Actor still initializing
  if (isFetching || !actor) {
    return null; // Still loading, no error yet
  }

  // Priority 3: Check for query failures
  const playersQuery = queryClient.getQueryState(queryKeys.players);
  const duelsQuery = queryClient.getQueryState(queryKeys.duels);

  if (playersQuery?.status === 'error') {
    return 'Failed to load player data. Please try refreshing the page.';
  }

  if (duelsQuery?.status === 'error') {
    return 'Failed to load duel data. Please try refreshing the page.';
  }

  return null;
}
