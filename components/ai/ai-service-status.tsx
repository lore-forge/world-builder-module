import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAIServiceStatus } from '@/hooks/use-world-builder-ai';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  Sparkles,
  Brain,
  Image,
  Mic,
  MapIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const serviceIcons: Record<string, any> = {
  character: Brain,
  scene: MapIcon,
  adventure: Sparkles,
  voice: Mic,
  image: Image
};

const serviceDescriptions: Record<string, string> = {
  character: "Generate NPCs with rich personalities",
  scene: "Create immersive locations and environments",
  adventure: "Design epic quests and storylines",
  voice: "Bring characters to life with voice synthesis",
  image: "Generate stunning visuals for your world"
};

export function AIServiceStatus() {
  const { 
    isOnline, 
    services, 
    lastCheck, 
    checkStatus, 
    autoCheckEnabled, 
    toggleAutoCheck 
  } = useAIServiceStatus();

  useEffect(() => {
    // Check status on mount
    checkStatus();
  }, [checkStatus]);

  const formatLastCheck = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              isOnline ? "bg-green-500/20" : "bg-red-500/20"
            )}>
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl">AI Services</CardTitle>
              <CardDescription>
                {isOnline ? 'All systems operational' : 'Some services may be unavailable'}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoCheck}
              className={cn(
                "transition-all",
                autoCheckEnabled && "border-green-500 text-green-500"
              )}
            >
              <Activity className={cn(
                "h-4 w-4 mr-1",
                autoCheckEnabled && "animate-pulse"
              )} />
              {autoCheckEnabled ? 'Auto-checking' : 'Auto-check'}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={checkStatus}
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(services).map(([service, status]) => {
            const Icon = serviceIcons[service] || Activity;
            return (
              <div
                key={service}
                className={cn(
                  "relative group",
                  "p-4 rounded-lg border transition-all duration-300",
                  "hover:shadow-md hover:scale-105",
                  status 
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" 
                    : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={cn(
                    "h-8 w-8 transition-colors",
                    status ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )} />
                  <span className="text-xs font-medium capitalize">{service}</span>
                  {status ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {serviceDescriptions[service] || 'AI Service'}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last checked: {formatLastCheck(lastCheck)}</span>
          <Badge variant={isOnline ? "default" : "destructive"}>
            {Object.values(services).filter(s => s).length}/{Object.keys(services).length} Services Active
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}