import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddPlayer, useRemovePlayer, useGetAllPlayers } from '@/hooks/useQueries';
import { UserPlus, Loader2 } from 'lucide-react';
import PlayerList from '@/components/PlayerList';
import { toast } from 'sonner';

export default function PlayersPage() {
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');

  const { data: players = [], isLoading } = useGetAllPlayers();
  const addPlayerMutation = useAddPlayer();
  const removePlayerMutation = useRemovePlayer();

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerId.trim() || !playerName.trim()) {
      toast.error('Please enter both player ID and display name');
      return;
    }

    try {
      await addPlayerMutation.mutateAsync({
        id: playerId.trim(),
        displayName: playerName.trim(),
      });
      toast.success(`${playerName} added successfully!`);
      setPlayerId('');
      setPlayerName('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add player');
    }
  };

  const handleRemovePlayer = async (id: string, name: string) => {
    try {
      await removePlayerMutation.mutateAsync(id);
      toast.success(`${name} removed from the server`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove player');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold pixel-text mb-2">Player Management</h2>
        <p className="text-muted-foreground">
          Add new players or manage existing ones. All players start with 10 hearts.
        </p>
      </div>

      {/* Add Player Form */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add New Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPlayer} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="playerId">Player ID</Label>
                <Input
                  id="playerId"
                  placeholder="e.g., player123"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  disabled={addPlayerMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="playerName">Display Name</Label>
                <Input
                  id="playerName"
                  placeholder="e.g., Steve"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  disabled={addPlayerMutation.isPending}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={addPlayerMutation.isPending}
              className="w-full sm:w-auto"
            >
              {addPlayerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Player
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Player List */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>All Players ({players.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <PlayerList 
            players={players} 
            isLoading={isLoading}
            onRemove={handleRemovePlayer}
            showActions
          />
        </CardContent>
      </Card>
    </div>
  );
}
