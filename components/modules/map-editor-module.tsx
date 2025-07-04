"use client"

import { useState } from 'react'
import { MapCanvas } from '@/components/map-editor/map-canvas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Save, FolderOpen, FileText, Settings2 } from 'lucide-react'

export function MapEditorModule() {
  const [mapName, setMapName] = useState('Untitled Map')
  const [mapType, setMapType] = useState('overworld')
  const [scale, setScale] = useState('1') // km per unit
  const [currentMapData, setCurrentMapData] = useState<string | null>(null)

  const handleSaveMap = async (imageData?: string) => {
    try {
      // In a real implementation, this would save to Firebase
      const mapData = {
        name: mapName,
        type: mapType,
        scale: parseFloat(scale),
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Map Editor</h2>
          <p className="text-muted-foreground">
            Create detailed maps for your worlds and campaigns
          </p>
        </div>
        <div className="flex gap-2">
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

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
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
  )
}
