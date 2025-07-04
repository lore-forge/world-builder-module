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

interface NPCDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NPCDialog({ open, onOpenChange }: NPCDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("")
  const [campaign, setCampaign] = useState("")

  const { campaigns, addNPC } = useAppStore()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "NPC name is required",
        variant: "destructive",
      })
      return
    }

    const newNPC = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      role: role || "Commoner",
      location: location || "Unknown",
      campaign: campaign || "Unassigned",
      status: "alive" as const,
    }

    addNPC(newNPC)

    toast({
      title: "Success",
      description: `NPC "${name}" has been created`,
    })

    // Reset form
    setName("")
    setDescription("")
    setRole("")
    setLocation("")
    setCampaign("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New NPC</DialogTitle>
          <DialogDescription>Create a new non-player character for your campaigns.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">NPC Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter NPC name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the NPC..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noble">Noble</SelectItem>
                  <SelectItem value="merchant">Merchant</SelectItem>
                  <SelectItem value="warrior">Warrior</SelectItem>
                  <SelectItem value="mage">Mage</SelectItem>
                  <SelectItem value="cleric">Cleric</SelectItem>
                  <SelectItem value="rogue">Rogue</SelectItem>
                  <SelectItem value="commoner">Commoner</SelectItem>
                  <SelectItem value="villain">Villain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where is this NPC located?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaign">Campaign</Label>
              <Select value={campaign} onValueChange={setCampaign}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create NPC</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
