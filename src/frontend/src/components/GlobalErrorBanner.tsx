import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface GlobalErrorBannerProps {
  message: string;
}

export default function GlobalErrorBanner({ message }: GlobalErrorBannerProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Alert variant="destructive" className="mb-6 border-2">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="font-bold">Connection Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="flex-1">{message}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="shrink-0 bg-background hover:bg-background/90"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}
