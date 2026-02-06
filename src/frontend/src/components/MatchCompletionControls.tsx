import { Button } from '@/components/ui/button';
import { useCompleteMatch } from '@/hooks/useQueries';
import { Trophy, Loader2 } from 'lucide-react';
import type { Duel } from '@/backend';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MatchCompletionControlsProps {
  duel: Duel;
  player1Name: string;
  player2Name: string;
}

export default function MatchCompletionControls({ 
  duel, 
  player1Name, 
  player2Name 
}: MatchCompletionControlsProps) {
  const completeMatchMutation = useCompleteMatch();

  const handleComplete = async (winnerId: string, winnerName: string) => {
    try {
      await completeMatchMutation.mutateAsync({
        matchId: duel.id,
        winnerId,
      });
      toast.success(`${winnerName} wins the duel!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to complete match');
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-center mb-2">Declare Winner</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="default" 
              className="w-full"
              disabled={completeMatchMutation.isPending}
            >
              {completeMatchMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trophy className="mr-2 h-4 w-4" />
              )}
              {player1Name}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Declare Winner</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure {player1Name} won this duel? Hearts will be transferred and stats will be updated.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleComplete(duel.player1, player1Name)}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="default" 
              className="w-full"
              disabled={completeMatchMutation.isPending}
            >
              {completeMatchMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trophy className="mr-2 h-4 w-4" />
              )}
              {player2Name}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Declare Winner</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure {player2Name} won this duel? Hearts will be transferred and stats will be updated.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleComplete(duel.player2, player2Name)}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
