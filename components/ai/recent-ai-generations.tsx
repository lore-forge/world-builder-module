import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain,
  MapPin,
  Sparkles,
  Mountain,
  Clock,
  ArrowRight,
  Image as ImageIcon,
  Mic
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIGeneration {
  id: string;
  type: 'npc' | 'location' | 'adventure' | 'terrain';
  name: string;
  timestamp: Date;
  hasImage: boolean;
  hasVoice: boolean;
  metadata?: any;
}

// Mock data for demonstration - in production, this would come from your state/database
const mockGenerations: AIGeneration[] = [
  {
    id: '1',
    type: 'npc',
    name: 'Elara the Mystic',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    hasImage: true,
    hasVoice: true,
    metadata: { race: 'Elf', occupation: 'Wizard' }
  },
  {
    id: '2',
    type: 'location',
    name: 'The Whispering Woods',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    hasImage: true,
    hasVoice: false,
    metadata: { type: 'forest', mood: 'mysterious' }
  },
  {
    id: '3',
    type: 'adventure',
    name: 'The Lost Crown of Eldoria',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    hasImage: true,
    hasVoice: false,
    metadata: { genre: 'fantasy', difficulty: 'medium' }
  },
  {
    id: '4',
    type: 'terrain',
    name: 'Crystal Peaks Mountain Range',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    hasImage: true,
    hasVoice: false,
    metadata: { biome: 'mountain', climate: 'arctic' }
  },
  {
    id: '5',
    type: 'npc',
    name: 'Grimlock the Forge Master',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    hasImage: true,
    hasVoice: false,
    metadata: { race: 'Dwarf', occupation: 'Blacksmith' }
  }
];

const typeConfig = {
  npc: {
    icon: Brain,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    label: 'NPC'
  },
  location: {
    icon: MapPin,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
    label: 'Location'
  },
  adventure: {
    icon: Sparkles,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    label: 'Adventure'
  },
  terrain: {
    icon: Mountain,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    label: 'Terrain'
  }
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
}

export function RecentAIGenerations() {
  return (
    <Card className="relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent AI Generations</CardTitle>
            <CardDescription>Your latest AI-powered creations</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="relative p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 p-6 pt-0">
            {mockGenerations.map((generation) => {
              const config = typeConfig[generation.type];
              const Icon = config.icon;
              
              return (
                <div
                  key={generation.id}
                  className={cn(
                    "group relative rounded-lg border p-4 transition-all duration-200",
                    "hover:shadow-md hover:scale-[1.02] cursor-pointer",
                    config.bgColor,
                    config.borderColor
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      config.bgColor
                    )}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{generation.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {config.label}
                            </Badge>
                            {generation.metadata && (
                              <span className="text-xs text-muted-foreground">
                                {generation.metadata.race || generation.metadata.type || generation.metadata.genre || generation.metadata.biome}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {generation.hasImage && (
                            <div className="p-1 rounded bg-gray-100 dark:bg-gray-800">
                              <ImageIcon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                            </div>
                          )}
                          {generation.hasVoice && (
                            <div className="p-1 rounded bg-gray-100 dark:bg-gray-800">
                              <Mic className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(generation.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}