import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles,
  Brain,
  MapPin,
  Mountain,
  Mic,
  Image,
  ChevronLeft,
  ChevronRight,
  Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  title: string;
  description: string;
  icon: any;
  gradient: string;
  tips: string[];
}

const aiFeatures: Feature[] = [
  {
    title: "NPC Generation",
    description: "Create complex characters with rich personalities, backstories, and unique voices",
    icon: Brain,
    gradient: "from-blue-500 to-cyan-500",
    tips: [
      "Include specific traits for unique personalities",
      "Add portrait generation for visual representation",
      "Voice synthesis brings characters to life"
    ]
  },
  {
    title: "Location Creation",
    description: "Build immersive environments with atmospheric descriptions and detailed features",
    icon: MapPin,
    gradient: "from-green-500 to-emerald-500",
    tips: [
      "Specify mood to set the atmosphere",
      "Include coordinates for map placement",
      "Generate images for visualization"
    ]
  },
  {
    title: "Adventure Design",
    description: "Craft epic quests with branching storylines and educational objectives",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    tips: [
      "Choose genre and theme for consistency",
      "Set difficulty for player experience",
      "Educational elements enhance engagement"
    ]
  },
  {
    title: "Terrain Generation",
    description: "Design realistic landscapes with climate systems and natural features",
    icon: Mountain,
    gradient: "from-orange-500 to-red-500",
    tips: [
      "Select biome for appropriate features",
      "Adjust size for map scale",
      "Climate affects gameplay mechanics"
    ]
  },
  {
    title: "Voice Synthesis",
    description: "Give your NPCs unique voices with emotion and personality",
    icon: Mic,
    gradient: "from-violet-500 to-indigo-500",
    tips: [
      "Emotional tone enhances immersion",
      "Multiple language support available",
      "Perfect for narrative moments"
    ]
  },
  {
    title: "Image Generation",
    description: "Create stunning visuals for characters, locations, and scenes",
    icon: Image,
    gradient: "from-pink-500 to-rose-500",
    tips: [
      "Detailed prompts yield better results",
      "Style options for consistency",
      "Multiple sizes for different uses"
    ]
  }
];

export function AIFeatureSpotlight() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % aiFeatures.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const feature = aiFeatures[currentFeature];
  const Icon = feature.icon;

  const goToFeature = (index: number) => {
    setCurrentFeature(index);
    setIsAutoPlaying(false);
  };

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % aiFeatures.length);
    setIsAutoPlaying(false);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + aiFeatures.length) % aiFeatures.length);
    setIsAutoPlaying(false);
  };

  return (
    <Card className="relative overflow-hidden group">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-10 transition-all duration-1000",
          feature.gradient
        )} />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>
      
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-xl bg-gradient-to-br text-white shadow-lg",
              feature.gradient
            )}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                AI Feature Spotlight
                <Wand2 className="h-4 w-4 text-muted-foreground animate-pulse" />
              </h3>
              <p className="text-sm text-muted-foreground">{feature.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={prevFeature}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={nextFeature}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm leading-relaxed">{feature.description}</p>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pro Tips</p>
            <ul className="space-y-1">
              {feature.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {aiFeatures.map((_, index) => (
            <button
              key={index}
              onClick={() => goToFeature(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentFeature 
                  ? "w-8 bg-primary" 
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        {isAutoPlaying && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Auto-play
            </div>
          </div>
        )}
      </CardContent>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </Card>
  );
}