"use client"

import { useState } from 'react'
import { MapCanvas } from '@/components/map-editor/map-canvas'
import { AITerrainGenerator } from '@/components/map-editor/ai-terrain-generator'
import { AILocationSuggester } from '@/components/map-editor/ai-location-suggester'
import { AIMapAssistant } from '@/components/map-editor/ai-map-assistant'
import { AIMapGeneratorDialog } from '@/components/map-editor/ai-map-generator-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Save, 
  FolderOpen, 
  Settings2, 
  Sparkles, 
  Map, 
  Wand2,
  Layers,
  Package
} from 'lucide-react'

export function MapEditorModule() {
  const [mapName, setMapName] = useState('Untitled Map')
  const [mapType, setMapType] = useState('overworld')
  const [scale, setScale] = useState('1') // km per unit
  const [currentMapData, setCurrentMapData] = useState<string | null>(null)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [terrain, setTerrain] = useState('mixed')
  const [climate, setClimate] = useState('Temperate')

  const handleSaveMap = async (imageData?: string) => {
    try {
      // In a real implementation, this would save to Firebase
      const mapData = {
        name: mapName,
        type: mapType,
        scale: parseFloat(scale),
        terrain,
        climate,
        imageData: imageData || currentMapData,
        updatedAt: new Date().toISOString()
      }
      
      console.log('Saving map:', mapData)
      toast.success('Map saved successfully!')
      
      // Store the image data for later use
      if (imageData) {
        setCurrentMapData(imageData)
      }
    } catch (error) {
      console.error('Error saving map:', error)
      toast.error('Failed to save map')
    }
  }

  const handleLoadMap = () => {
    // In a real implementation, this would load from Firebase
    toast.info('Map loading functionality coming soon!')
  }

  const handleMapGenerated = (mapData: any) => {
    // Handle the generated map data
    setMapName(mapData.name)
    toast.success('Map generated! You can now edit it.')
    // In a real implementation, this would load the generated map into the canvas
  }

  const handleTerrainGenerated = (terrainData: any) => {
    // Handle terrain generation
    toast.success('Terrain features added to map!')
    // In a real implementation, this would add terrain to the canvas
  }

  const handleLocationAdd = (location: any) => {
    // Handle adding location to map
    console.log('Adding location:', location)
    // In a real implementation, this would add the location marker to the canvas
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Map Editor</h2>
          <p className="text-muted-foreground">
            Create detailed maps with AI-powered assistance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGenerateDialog(true)}>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Map
          </Button>
          <Button variant="outline" onClick={handleLoadMap}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Load Map
          </Button>
          <Button onClick={() => handleSaveMap()}>
            <Save className="mr-2 h-4 w-4" />
            Save Map
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Editor Area */}
        <div className="col-span-12 lg:col-span-8">
          <Tabs defaultValue="editor" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">
                <Map className="mr-2 h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="properties">
                <Settings2 className="mr-2 h-4 w-4" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="layers">
                <Layers className="mr-2 h-4 w-4" />
                Layers
              </TabsTrigger>
              <TabsTrigger value="assets">
                <Package className="mr-2 h-4 w-4" />
                Assets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <MapCanvas 
                    width={1200} 
                    height={800} 
                    onSave={handleSaveMap}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Map Properties</CardTitle>
                  <CardDescription>
                    Configure the basic properties of your map
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="map-name">Map Name</Label>
                      <Input
                        id="map-name"
                        value={mapName}
                        onChange={(e) => setMapName(e.target.value)}
                        placeholder="Enter map name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="map-type">Map Type</Label>
                      <Select value={mapType} onValueChange={setMapType}>
                        <SelectTrigger id="map-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overworld">Overworld</SelectItem>
                          <SelectItem value="region">Region</SelectItem>
                          <SelectItem value="city">City</SelectItem>
                          <SelectItem value="dungeon">Dungeon</SelectItem>
                          <SelectItem value="building">Building</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="map-scale">Scale (km per unit)</Label>
                      <Input
                        id="map-scale"
                        type="number"
                        value={scale}
                        onChange={(e) => setScale(e.target.value)}
                        placeholder="1"
                        min="0.1"
                        step="0.1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="climate">Climate</Label>
                      <Select value={climate} onValueChange={setClimate}>
                        <SelectTrigger id="climate">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Temperate">Temperate</SelectItem>
                          <SelectItem value="Tropical">Tropical</SelectItem>
                          <SelectItem value="Arctic">Arctic</SelectItem>
                          <SelectItem value="Desert">Desert</SelectItem>
                          <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={() => handleSaveMap()} className="w-full">
                      Save Properties
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Layer Management</CardTitle>
                  <CardDescription>
                    Organize your map into different layers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Layer management coming soon!
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Map Assets</CardTitle>
                  <CardDescription>
                    Manage reusable assets and symbols
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Asset library coming soon!
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Tools Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* AI Map Assistant */}
          <AIMapAssistant 
            mapData={{
              name: mapName,
              type: mapType,
              terrain,
              climate
            }}
          />

          {/* AI Terrain Generator */}
          <AITerrainGenerator onTerrainGenerated={handleTerrainGenerated} />

          {/* AI Location Suggester */}
          <AILocationSuggester 
            mapContext={{
              terrain,
              climate
            }}
            onLocationAdd={handleLocationAdd}
          />
        </div>
      </div>

      {/* AI Map Generator Dialog */}
      <AIMapGeneratorDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        onMapGenerated={handleMapGenerated}
      />
    </div>
  )
}
