import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Trophy, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import type { Player } from '@/backend';
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

interface PlayerListProps {
  players: Player[];
  isLoading?: boolean;
  showRank?: boolean;
  showActions?: boolean;
  onRemove?: (id: string, name: string) => void;
}

export default function PlayerList({ 
  players, 
  isLoading, 
  showRank, 
  showActions,
  onRemove 
}: PlayerListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No players found. Add some players to get started!
      </div>
    );
  }

  return (
    <div className="rounded-md border-2 border-primary/20 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {showRank && <TableHead className="w-12">#</TableHead>}
            <TableHead>Player</TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Heart className="w-4 h-4" />
                Hearts
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4" />
                W/L
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Won
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="w-4 h-4" />
                Lost
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => (
            <TableRow key={player.id} className={player.eliminated ? 'opacity-60' : ''}>
              {showRank && (
                <TableCell className="font-bold pixel-text">
                  {index + 1}
                </TableCell>
              )}
              <TableCell className="font-medium">{player.displayName}</TableCell>
              <TableCell className="text-center">
                <span className="font-bold pixel-text text-lg">
                  {Number(player.currentHearts)}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-sm">
                  {Number(player.wins)} / {Number(player.losses)}
                </span>
              </TableCell>
              <TableCell className="text-center text-green-600 dark:text-green-400">
                {Number(player.heartsWon)}
              </TableCell>
              <TableCell className="text-center text-red-600 dark:text-red-400">
                {Number(player.heartsLost)}
              </TableCell>
              <TableCell>
                {player.eliminated ? (
                  <Badge variant="destructive">Eliminated</Badge>
                ) : (
                  <Badge variant="default">Active</Badge>
                )}
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Player</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {player.displayName}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onRemove?.(player.id, player.displayName)}
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
