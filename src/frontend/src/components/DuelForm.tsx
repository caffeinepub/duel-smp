import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetAllPlayers, useCreateDuel, useGenerateRandomDuel } from '@/hooks/useQueries';
import { Loader2, Shuffle, Swords } from 'lucide-react';
import { BetMode } from '@/backend';
import { toast } from 'sonner';

export default function DuelForm() {
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [p1Bet, setP1Bet] = useState('1');
  const [p2Bet, setP2Bet] = useState('1');
  const [betMode, setBetMode] = useState<'agreed' | 'blind'>('agreed');

  const { data: players = [] } = useGetAllPlayers();
  const createDuelMutation = useCreateDuel();
  const generateRandomMutation = useGenerateRandomDuel();

  const eligiblePlayers = players.filter((p) => !p.eliminated && Number(p.currentHearts) > 0);

  const handleCreateDuel = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!player1Id || !player2Id) {
      toast.error('Please select both players');
      return;
    }

    if (player1Id === player2Id) {
      toast.error('Please select different players');
      return;
    }

    const p1BetNum = parseInt(p1Bet);
    const p2BetNum = parseInt(p2Bet);

    if (p1BetNum < 1 || p1BetNum > 5 || p2BetNum < 1 || p2BetNum > 5) {
      toast.error('Bets must be between 1 and 5 hearts');
      return;
    }

    const player1 = players.find((p) => p.id === player1Id);
    const player2 = players.find((p) => p.id === player2Id);

    if (player1 && Number(player1.currentHearts) < p1BetNum) {
      toast.error(`${player1.displayName} doesn't have enough hearts for this bet`);
      return;
    }

    if (player2 && Number(player2.currentHearts) < p2BetNum) {
      toast.error(`${player2.displayName} doesn't have enough hearts for this bet`);
      return;
    }

    try {
      await createDuelMutation.mutateAsync({
        player1: player1Id,
        player2: player2Id,
        p1Bet: BigInt(p1BetNum),
        p2Bet: BigInt(p2BetNum),
        betMode: betMode === 'agreed' ? BetMode.agreed : BetMode.blind,
      });
      toast.success('Duel created successfully!');
      setPlayer1Id('');
      setPlayer2Id('');
      setP1Bet('1');
      setP2Bet('1');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create duel');
    }
  };

  const handleRandomDuel = async () => {
    if (eligiblePlayers.length < 2) {
      toast.error('Not enough eligible players for a random duel');
      return;
    }

    try {
      await generateRandomMutation.mutateAsync();
      toast.success('Random duel generated!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate random duel');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateDuel} className="space-y-4">
        {/* Player Selection */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="player1">Player 1</Label>
            <Select value={player1Id} onValueChange={setPlayer1Id}>
              <SelectTrigger id="player1">
                <SelectValue placeholder="Select player 1" />
              </SelectTrigger>
              <SelectContent>
                {eligiblePlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.displayName} ({Number(player.currentHearts)} ❤️)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="player2">Player 2</Label>
            <Select value={player2Id} onValueChange={setPlayer2Id}>
              <SelectTrigger id="player2">
                <SelectValue placeholder="Select player 2" />
              </SelectTrigger>
              <SelectContent>
                {eligiblePlayers.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.displayName} ({Number(player.currentHearts)} ❤️)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bet Amounts */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="p1Bet">Player 1 Bet (1-5 hearts)</Label>
            <Input
              id="p1Bet"
              type="number"
              min="1"
              max="5"
              value={p1Bet}
              onChange={(e) => setP1Bet(e.target.value)}
              disabled={createDuelMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="p2Bet">Player 2 Bet (1-5 hearts)</Label>
            <Input
              id="p2Bet"
              type="number"
              min="1"
              max="5"
              value={p2Bet}
              onChange={(e) => setP2Bet(e.target.value)}
              disabled={createDuelMutation.isPending}
            />
          </div>
        </div>

        {/* Bet Mode */}
        <div className="space-y-2">
          <Label>Bet Mode</Label>
          <RadioGroup value={betMode} onValueChange={(v) => setBetMode(v as 'agreed' | 'blind')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="agreed" id="agreed" />
              <Label htmlFor="agreed" className="font-normal cursor-pointer">
                Agreed - Both players see the bets
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blind" id="blind" />
              <Label htmlFor="blind" className="font-normal cursor-pointer">
                Blind - Bets hidden until match completion
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            type="submit" 
            disabled={createDuelMutation.isPending}
            className="flex-1"
          >
            {createDuelMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Swords className="mr-2 h-4 w-4" />
                Create Duel
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleRandomDuel}
            disabled={generateRandomMutation.isPending || eligiblePlayers.length < 2}
            className="flex-1"
          >
            {generateRandomMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Shuffle className="mr-2 h-4 w-4" />
                Random Duel
              </>
            )}
          </Button>
        </div>
      </form>

      {eligiblePlayers.length < 2 && (
        <p className="text-sm text-destructive">
          Not enough eligible players. Add more players or ensure they have hearts remaining.
        </p>
      )}
    </div>
  );
}
