import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllDuels } from '@/hooks/useQueries';
import { Swords } from 'lucide-react';
import DuelForm from '@/components/DuelForm';
import ActiveDuelCard from '@/components/ActiveDuelCard';
import { MatchStatus } from '@/backend';

export default function DuelPage() {
  const { data: duels = [] } = useGetAllDuels();

  // Find the most recent pending duel
  const activeDuel = duels
    .filter((d) => d.status === MatchStatus.pending)
    .sort((a, b) => Number(b.timestamp - a.timestamp))[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold pixel-text mb-2 flex items-center gap-2">
          <Swords className="w-8 h-8 text-primary" />
          Create Duel
        </h2>
        <p className="text-muted-foreground">
          Set up a new match between two players or generate a random duel
        </p>
      </div>

      {/* Active Duel */}
      {activeDuel && (
        <ActiveDuelCard duel={activeDuel} />
      )}

      {/* Duel Creation Form */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>New Duel</CardTitle>
        </CardHeader>
        <CardContent>
          <DuelForm />
        </CardContent>
      </Card>
    </div>
  );
}
