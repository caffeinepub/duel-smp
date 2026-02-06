import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllDuels } from '@/hooks/useQueries';
import { Scroll } from 'lucide-react';
import MatchHistoryList from '@/components/MatchHistoryList';
import { MatchStatus } from '@/backend';

export default function HistoryPage() {
  const { data: duels = [], isLoading } = useGetAllDuels();

  const completedDuels = duels
    .filter((d) => d.status === MatchStatus.complete)
    .sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold pixel-text mb-2 flex items-center gap-2">
          <Scroll className="w-8 h-8 text-primary" />
          Match History
        </h2>
        <p className="text-muted-foreground">
          View all completed duels and their outcomes
        </p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Completed Matches ({completedDuels.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <MatchHistoryList duels={completedDuels} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
