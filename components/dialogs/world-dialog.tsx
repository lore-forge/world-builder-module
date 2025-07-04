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

interface WorldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorldDialog({ open, onOpenChange }: WorldDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [genre, setGenre] = useState("")
  const [setting, setSetting] = useState("")

  const { addWorld } = useAppStore()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "World name is required",
        variant: "destructive",
      })
      return
    }

    const newWorld = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      genre,
      setting,
      status: "active" as const,
      campaigns: 0,
      locations: 0,
      createdAt: new Date().toLocaleDateString(),
    }

    addWorld(newWorld)

    toast({
      title: "Success",
      description: `World "${name}" has been created`,
    })

    // Reset form
    setName("")
    setDescription("")
    setGenre("")
    setSetting("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New World</DialogTitle>
          <DialogDescription>Create a new world for your campaigns. Add details to bring it to life.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">World Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter world name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your world..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="genre">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="sci-fi">Science Fiction</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="historical">Historical</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                  <SelectItem value="steampunk">Steampunk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="setting">Setting</Label>
              <Select value={setting} onValueChange={setSetting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select setting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medieval">Medieval</SelectItem>
                  <SelectItem value="renaissance">Renaissance</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="futuristic">Futuristic</SelectItem>
                  <SelectItem value="post-apocalyptic">Post-Apocalyptic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create World</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
