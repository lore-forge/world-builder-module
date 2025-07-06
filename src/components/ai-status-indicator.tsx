/**
 * AI Services Status Indicator Component
 */

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useAIServices } from '../hooks/use-ai-services';

interface AIStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export function AIStatusIndicator({ showDetails = false, className = '' }: AIStatusIndicatorProps) {
  const { isHealthy, isLoading, error, lastHealthCheck, checkHealth } = useAIServices();

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (isHealthy) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Checking...';
    if (error) return 'Offline';
    if (isHealthy) return 'Online';
    return 'Unknown';
  };

  const getStatusVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (isLoading) return 'secondary';
    if (error) return 'destructive';
    if (isHealthy) return 'default';
    return 'outline';
  };

  const getTooltipContent = () => {
    if (isLoading) {
      return 'Checking AI services status...';
    }
    if (error) {
      return `AI services unavailable: ${error}`;
    }
    if (lastHealthCheck) {
      return (
        <div className="space-y-1">
          <p>AI Services: {lastHealthCheck.status}</p>
          <p>Version: {lastHealthCheck.version}</p>
          <p>Services: {lastHealthCheck.services.join(', ')}</p>
          <p>Last check: {new Date(lastHealthCheck.timestamp).toLocaleTimeString()}</p>
        </div>
      );
    }
    return 'AI services status unknown';
  };

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={getStatusVariant()} className={`flex items-center gap-2 ${className}`}>
              {getStatusIcon()}
              AI {getStatusText()}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Badge variant={getStatusVariant()} className="flex items-center gap-2">
        {getStatusIcon()}
        AI Services {getStatusText()}
      </Badge>
      
      {lastHealthCheck && (
        <div className="text-xs text-muted-foreground">
          v{lastHealthCheck.version} • {lastHealthCheck.services.length} services
        </div>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={checkHealth}
        disabled={isLoading}
        className="h-auto p-1"
      >
        <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
      
      {error && (
        <div className="text-xs text-red-600 max-w-xs truncate">
          {error}
        </div>
      )}
    </div>
  );
}