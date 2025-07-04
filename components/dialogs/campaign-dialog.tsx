"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface CampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CampaignDialog({ open, onOpenChange }: CampaignDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [world, setWorld] = useState("")
  const [players, setPlayers] = useState("")

  const { worlds, addCampaign } = useAppStore()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Campaign name is required",
        variant: "destructive",
      })
      return
    }

    const newCampaign = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      world: world || "Unknown World",
      players: Number.parseInt(players) || 0,
      status: "planning" as const,
      startDate: new Date().toLocaleDateString(),
    }

    addCampaign(newCampaign)

    toast({
      title: "Success",
      description: `Campaign "${name}" has been created`,
    })

    // Reset form
    setName("")
    setDescription("")
    setWorld("")
    setPlayers("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>Create a new campaign for your adventures. Set up the basic details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter campaign name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your campaign..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="world">World</Label>
              <Select value={world} onValueChange={setWorld}>
                <SelectTrigger>
                  <SelectValue placeholder="Select world" />
                </SelectTrigger>
                <SelectContent>
                  {worlds.map((w) => (
                    <SelectItem key={w.id} value={w.name}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="players">Number of Players</Label>
              <Input
                id="players"
                type="number"
                value={players}
                onChange={(e) => setPlayers(e.target.value)}
                placeholder="Enter number of players"
                min="1"
                max="10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Campaign</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
