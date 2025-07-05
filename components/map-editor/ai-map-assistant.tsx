import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkles, 
  Lightbulb, 
  MessageSquare, 
  Wand2, 
  Send, 
  Copy, 
  Check,
  Info,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { useWorldBuilderAI } from '@/hooks/use-world-builder-ai'

interface MapAssistantProps {
  mapData?: {
    name: string
    type: string
    terrain?: string
    climate?: string
  }
}

interface Suggestion {
  id: string
  type: 'tip' | 'idea' | 'warning'
  title: string
  content: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIMapAssistant({ mapData }: MapAssistantProps) {
  const [activeTab, setActiveTab] = useState('suggestions')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { askMapAssistant } = useWorldBuilderAI()

  // Mock suggestions based on map context
  const suggestions: Suggestion[] = [
    {
      id: '1',
      type: 'tip',
      title: 'Add Natural Barriers',
      content: 'Consider adding mountain ranges or rivers to create natural boundaries between regions. This helps with political divisions and trade routes.',
    },
    {
      id: '2',
      type: 'idea',
      title: 'Hidden Location',
      content: `In your ${mapData?.terrain || 'terrain'}, you could add a hidden sanctuary or lost city. Perfect for quest destinations!`,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Scale Consistency',
      content: 'Make sure your city sizes are proportional to the map scale. A major city should be visibly larger than towns.',
    },
    {
      id: '4',
      type: 'tip',
      title: 'Trade Routes',
      content: 'Connect your major cities with roads or rivers. This creates logical trade routes and helps with world-building.',
    },
    {
      id: '5',
      type: 'idea',
      title: 'Points of Interest',
      content: 'Add mysterious landmarks like ancient ruins, magical anomalies, or natural wonders to spark adventure ideas.',
    }
  ]

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsProcessing(true)

    try {
      // Mock AI response
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on your ${mapData?.type || 'map'}, here's my suggestion: Consider adding elevation markers to show topographical features. This will help players understand travel difficulty and strategic positions. Would you like me to suggest specific elevation patterns for your ${mapData?.terrain || 'terrain type'}?`,
        timestamp: new Date()
      }

      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      toast.error('Failed to get AI response')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case 'idea':
        return <Wand2 className="h-4 w-4 text-purple-500" />
      case 'warning':
        return <Info className="h-4 w-4 text-orange-500" />
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Map Assistant
        </CardTitle>
        <CardDescription>
          Get intelligent suggestions and help for your map
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="flex-1 mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="rounded-lg border p-3 space-y-2 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getSuggestionIcon(suggestion.type)}
                        <h4 className="font-medium">{suggestion.title}</h4>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(suggestion.content, suggestion.id)}
                      >
                        {copiedId === suggestion.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.content}
                    </p>
                    {suggestion.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={suggestion.action.onClick}
                      >
                        {suggestion.action.label}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 flex flex-col mt-4">
            <ScrollArea className="flex-1 h-[350px] mb-4">
              <div className="space-y-4 pr-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Ask me anything about your map!</p>
                    <p className="text-sm mt-1">I can help with terrain, locations, lore, and more.</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                placeholder="Ask about your map..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isProcessing}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isProcessing}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
