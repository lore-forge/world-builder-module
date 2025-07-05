import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp,
  Zap,
  Target,
  Award,
  Brain,
  MapPin,
  Sparkles,
  Mountain
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationStats {
  type: 'npc' | 'location' | 'adventure' | 'terrain';
  count: number;
  trend: number; // percentage change
  quota: number;
  used: number;
}

// Mock data - in production, this would come from your API/state
const stats: GenerationStats[] = [
  { type: 'npc', count: 47, trend: 12, quota: 100, used: 47 },
  { type: 'location', count: 32, trend: 8, quota: 100, used: 32 },
  { type: 'adventure', count: 15, trend: 25, quota: 50, used: 15 },
  { type: 'terrain', count: 23, trend: -5, quota: 50, used: 23 }
];

const typeConfig = {
  npc: {
    icon: Brain,
    label: 'NPCs',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  },
  location: {
    icon: MapPin,
    label: 'Locations',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20'
  },
  adventure: {
    icon: Sparkles,
    label: 'Adventures',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
  },
  terrain: {
    icon: Mountain,
    label: 'Terrains',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20'
  }
};

export function AIGenerationStats() {
  const totalGenerations = stats.reduce((sum, stat) => sum + stat.count, 0);
  const totalQuota = stats.reduce((sum, stat) => sum + stat.quota, 0);
  const totalUsed = stats.reduce((sum, stat) => sum + stat.used, 0);
  const overallUsagePercentage = (totalUsed / totalQuota) * 100;

  // Calculate achievements
  const achievements = [
    { 
      icon: Award, 
      label: 'World Builder', 
      achieved: totalGenerations > 100,
      description: 'Generate 100+ items'
    },
    { 
      icon: Zap, 
      label: 'Speed Creator', 
      achieved: stats.some(s => s.count > 40),
      description: '40+ of any type'
    },
    { 
      icon: Target, 
      label: 'Balanced Creator', 
      achieved: stats.every(s => s.count > 10),
      description: '10+ of each type'
    }
  ];

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
      
      <CardHeader className="relative">
        <CardTitle>AI Generation Statistics</CardTitle>
        <CardDescription>Track your creative output and usage</CardDescription>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Overall Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Monthly Usage</span>
            <span className="text-muted-foreground">{totalUsed} / {totalQuota}</span>
          </div>
          <Progress value={overallUsagePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {Math.round(overallUsagePercentage)}% of monthly quota used
          </p>
        </div>

        {/* Generation Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const config = typeConfig[stat.type];
            const Icon = config.icon;
            const usagePercentage = (stat.used / stat.quota) * 100;
            
            return (
              <div
                key={stat.type}
                className="space-y-3 p-3 rounded-lg border bg-card/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded", config.bgColor)}>
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <span className="font-medium text-sm">{config.label}</span>
                  </div>
                  <span className="text-xl font-bold">{stat.count}</span>
                </div>
                
                <div className="space-y-1">
                  <Progress value={usagePercentage} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {stat.used}/{stat.quota} quota
                    </span>
                    <div className={cn(
                      "flex items-center gap-0.5",
                      stat.trend > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      <TrendingUp className={cn(
                        "h-3 w-3",
                        stat.trend < 0 && "rotate-180"
                      )} />
                      <span>{Math.abs(stat.trend)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Achievements</h4>
          <div className="grid grid-cols-3 gap-2">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className={cn(
                    "relative p-3 rounded-lg border text-center transition-all",
                    achievement.achieved
                      ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700"
                      : "bg-muted/30 border-border opacity-60"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 mx-auto mb-1",
                    achievement.achieved
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground"
                  )} />
                  <p className="text-xs font-medium">{achievement.label}</p>
                  {achievement.achieved && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Generations */}
        <div className="text-center pt-2 border-t">
          <p className="text-2xl font-bold">{totalGenerations}</p>
          <p className="text-sm text-muted-foreground">Total Generations</p>
        </div>
      </CardContent>
    </Card>
  );
}