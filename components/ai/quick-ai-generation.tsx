import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorldBuilderAI } from '@/hooks/use-world-builder-ai';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';
import { 
  Sparkles,
  Brain,
  MapPin,
  Mountain,
  Loader2,
  Wand2,
  Plus
} from 'lucide-react';

export function QuickAIGeneration() {
  const { toast } = useToast();
  const { generateNPC, generateLocation, generateAdventure, generateTerrain, loadingStates } = useWorldBuilderAI();
  const { setCurrentModule } = useAppStore();
  
  const [npcName, setNpcName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [adventureTitle, setAdventureTitle] = useState('');
  const [terrainType, setTerrainType] = useState('');

  const handleNPCGeneration = async () => {
    if (!npcName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the NPC",
        variant: "destructive"
      });
      return;
    }

    const result = await generateNPC({
      name: npcName,
      race: "Human",
      occupation: "Adventurer",
      includePortrait: true,
      includeVoice: false
    });

    if (result.success) {
      toast({
        title: "NPC Created!",
        description: `${result.data?.name} has been added to your world`,
      });
      setNpcName('');
    } else {
      toast({
        title: "Generation Failed",
        description: result.error || "Failed to generate NPC",
        variant: "destructive"
      });
    }
  };

  const handleLocationGeneration = async () => {
    if (!locationName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the location",
        variant: "destructive"
      });
      return;
    }

    const result = await generateLocation({
      name: locationName,
      type: "town",
      mood: "mysterious",
      includeImage: true
    });

    if (result.success) {
      toast({
        title: "Location Created!",
        description: `${result.data?.name} has been added to your world`,
      });
      setLocationName('');
    } else {
      toast({
        title: "Generation Failed",
        description: result.error || "Failed to generate location",
        variant: "destructive"
      });
    }
  };

  const handleAdventureGeneration = async () => {
    if (!adventureTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the adventure",
        variant: "destructive"
      });
      return;
    }

    const result = await generateAdventure({
      title: adventureTitle,
      genre: "fantasy",
      theme: "mystery",
      difficulty: "medium",
      includeImage: true
    });

    if (result.success) {
      toast({
        title: "Adventure Created!",
        description: `${result.data?.title} is ready to explore`,
      });
      setAdventureTitle('');
    } else {
      toast({
        title: "Generation Failed",
        description: result.error || "Failed to generate adventure",
        variant: "destructive"
      });
    }
  };

  const handleTerrainGeneration = async () => {
    if (!terrainType.trim()) {
      toast({
        title: "Type Required",
        description: "Please enter a terrain type",
        variant: "destructive"
      });
      return;
    }

    const result = await generateTerrain({
      biome: terrainType as any,
      size: "medium",
      features: [],
      climate: "temperate"
    });

    if (result.success) {
      toast({
        title: "Terrain Generated!",
        description: `New ${terrainType} terrain has been created`,
      });
      setTerrainType('');
    } else {
      toast({
        title: "Generation Failed",
        description: result.error || "Failed to generate terrain",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20">
            <Wand2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <CardTitle>Quick AI Generation</CardTitle>
            <CardDescription>Instantly create content with AI assistance</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <Tabs defaultValue="npc" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="npc" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">NPC</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Location</span>
            </TabsTrigger>
            <TabsTrigger value="adventure" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Adventure</span>
            </TabsTrigger>
            <TabsTrigger value="terrain" className="flex items-center gap-1">
              <Mountain className="h-4 w-4" />
              <span className="hidden sm:inline">Terrain</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="npc" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="npc-name">Character Name</Label>
              <Input
                id="npc-name"
                placeholder="Enter NPC name..."
                value={npcName}
                onChange={(e) => setNpcName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNPCGeneration()}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleNPCGeneration} 
                disabled={loadingStates.npc}
                className="flex-1"
              >
                {loadingStates.npc && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate NPC
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentModule('npcs')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="location" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location-name">Location Name</Label>
              <Input
                id="location-name"
                placeholder="Enter location name..."
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLocationGeneration()}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleLocationGeneration} 
                disabled={loadingStates.location}
                className="flex-1"
              >
                {loadingStates.location && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Location
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentModule('locations')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="adventure" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adventure-title">Adventure Title</Label>
              <Input
                id="adventure-title"
                placeholder="Enter adventure title..."
                value={adventureTitle}
                onChange={(e) => setAdventureTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdventureGeneration()}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleAdventureGeneration} 
                disabled={loadingStates.adventure}
                className="flex-1"
              >
                {loadingStates.adventure && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Adventure
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentModule('campaigns')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="terrain" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="terrain-type">Terrain Type</Label>
              <Input
                id="terrain-type"
                placeholder="Forest, Mountain, Desert..."
                value={terrainType}
                onChange={(e) => setTerrainType(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTerrainGeneration()}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleTerrainGeneration} 
                disabled={loadingStates.terrain}
                className="flex-1"
              >
                {loadingStates.terrain && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Terrain
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentModule('map-editor')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}