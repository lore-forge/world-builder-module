// Core types for World Builder module

export interface World {
  id: string
  name: string
  description: string
  genre: 'fantasy' | 'scifi' | 'historical' | 'educational' | 'custom'
  educationalFocus?: string[]
  creator: string
  collaborators: string[]
  isPublic: boolean
  maps: Map[]
  timeline: TimelineEvent[]
  cultures: Culture[]
  languages: Language[]
  metadata: WorldMetadata
  createdAt: Date
  updatedAt: Date
}

export interface Map {
  id: string
  worldId: string
  name: string
  type: 'overworld' | 'region' | 'city' | 'dungeon' | 'building'
  dimensions: { width: number; height: number }
  layers: MapLayer[]
  locations: Location[]
  scale: number // km per pixel
  climate: ClimateSettings
  createdAt: Date
  updatedAt: Date
}

export interface MapLayer {
  id: string
  name: string
  type: 'terrain' | 'political' | 'climate' | 'custom'
  visible: boolean
  opacity: number
  data: any // Canvas/image data
}

export interface Location {
  id: string
  mapId: string
  name: string
  type: LocationType
  coordinates: { x: number; y: number }
  description: string
  educationalContent?: EducationalContent
  npcs: NPC[]
  items: Item[]
  quests: Quest[]
  environment: EnvironmentSettings
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface NPC {
  id: string
  name: string
  race: string
  occupation: string
  personality: PersonalityTraits
  backstory: string
  knowledge: KnowledgeBase[]
  dialogueTree: DialogueNode[]
  relationships: Relationship[]
  stats?: CharacterStats
  voiceId?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Campaign {
  id: string
  worldId: string
  name: string
  description: string
  storyArcs: StoryArc[]
  questChains: QuestChain[]
  educationalObjectives: LearningObjective[]
  sessions: Session[]
  playerNotes: boolean
  gmNotes: string
  createdAt: Date
  updatedAt: Date
}

export interface Adventure {
  id: string
  worldId: string
  name: string
  description: string
  storyArcs: StoryArc[]
  questChains: QuestChain[]
  educationalObjectives: LearningObjective[]
  sessions: Session[]
  playerNotes: boolean
  gmNotes: string
  createdAt: Date
  updatedAt: Date
}

export interface EducationalContent {
  subject: 'history' | 'geography' | 'science' | 'literature' | 'math' | 'custom'
  topics: string[]
  learningObjectives: string[]
  assessments: Assessment[]
  realWorldConnection: string
}

// AI Service Request Types
export interface WorldGenerationRequest {
  name: string
  genre: 'fantasy' | 'scifi' | 'historical' | 'educational' | 'custom'
  description: string
  educationalFocus?: string[]
  theme?: string
  complexity: 'simple' | 'moderate' | 'complex'
  includeImage?: boolean
}

export interface NPCGenerationRequest {
  name?: string
  race: string
  occupation: string
  personality?: string
  background?: string
  setting?: string
  knowledgeAreas?: string[]
  includePortrait?: boolean
  includeVoice?: boolean
}

export interface LocationGenerationRequest {
  mapId: string
  name: string
  type: LocationType
  coordinates: { x: number; y: number }
  description?: string
  atmosphere?: string
  educationalContent?: EducationalContent
  environment?: EnvironmentSettings
  includeImage?: boolean
  mood?: string
  style?: string
}

export interface AdventureGenerationRequest {
  worldId: string
  title: string
  description?: string
  genre?: 'fantasy' | 'scifi' | 'historical' | 'educational' | 'custom'
  theme?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  educationalObjectives?: LearningObjective[]
  includeImage?: boolean
}

export interface TerrainGenerationRequest {
  biome: string
  size: string
  features: string[]
  climate: string
  includeImage?: boolean
}

// Supporting types
export interface WorldMetadata {
  tags: string[]
  coverImage?: string
  lastPlayed?: Date
  playCount: number
  rating?: number
}

export interface ClimateSettings {
  temperature: 'arctic' | 'cold' | 'temperate' | 'warm' | 'tropical'
  humidity: 'arid' | 'dry' | 'moderate' | 'humid' | 'wet'
  season: 'spring' | 'summer' | 'autumn' | 'winter'
}

export interface EnvironmentSettings {
  timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night'
  weather: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog'
  ambientSounds?: string[]
  lightLevel?: number // 0-100
  temperature?: number
  season?: 'spring' | 'summer' | 'autumn' | 'winter'
}

export type LocationType = 
  | 'city' | 'town' | 'village' | 'castle' | 'fort'
  | 'dungeon' | 'cave' | 'ruin' | 'temple' | 'shrine'
  | 'forest' | 'mountain' | 'lake' | 'river' | 'coast'
  | 'school' | 'library' | 'museum' | 'laboratory'
  | 'custom'

export interface PersonalityTraits {
  traits: string[]
  motivations: string[]
  fears: string[]
  secrets: string[]
  alignment?: string
  ideals?: string[]
  bonds?: string[]
  flaws?: string[]
  mannerisms?: string[]
}

export interface KnowledgeBase {
  topic: string
  expertise: 'novice' | 'intermediate' | 'expert' | 'master'
  facts: string[]
}

export interface DialogueNode {
  id: string
  text: string
  conditions?: DialogueCondition[]
  responses: DialogueResponse[]
  actions?: DialogueAction[]
}

export interface Relationship {
  npcId: string
  type: 'family' | 'friend' | 'rival' | 'mentor' | 'student' | 'employer' | 'employee'
  strength: number // -100 to 100
  description: string
}

export interface CharacterStats {
  level?: number
  health?: number
  maxHealth?: number
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  attributes?: {
    strength: number
    agility: number
    intelligence: number
    wisdom: number
    charisma: number
    constitution: number
  }
}

export interface Quest {
  id: string
  name: string
  description: string
  objectives: QuestObjective[]
  rewards: Reward[]
  prerequisites?: string[]
  educationalGoals?: string[]
}

export interface Item {
  id: string
  name: string
  description: string
  type: 'weapon' | 'armor' | 'consumable' | 'key' | 'educational' | 'misc'
  value: number
  properties?: ItemProperty[]
}

export interface TimelineEvent {
  id: string
  date: string // Can be relative or absolute
  title: string
  description: string
  impact: 'minor' | 'moderate' | 'major' | 'worldchanging'
  relatedLocations?: string[]
  relatedNPCs?: string[]
}

export interface Culture {
  id: string
  name: string
  description: string
  values: string[]
  customs: string[]
  language?: string
  religion?: string
  government?: string
}

export interface Language {
  id: string
  name: string
  alphabet?: string
  commonPhrases: { phrase: string; translation: string }[]
  rules?: string[]
}

export interface StoryArc {
  id: string
  name: string
  description: string
  chapters: Chapter[]
  status: 'planned' | 'active' | 'completed'
}

export interface QuestChain {
  id: string
  name: string
  quests: string[] // Quest IDs in order
  rewards: Reward[]
}

export interface Session {
  id: string
  date: Date
  title: string
  summary: string
  npcsEncountered: string[]
  locationsVisited: string[]
  questsCompleted: string[]
  notes: string
}

export interface LearningObjective {
  id: string
  subject: string
  topic: string
  description: string
  assessmentCriteria: string[]
}

export interface Assessment {
  id: string
  type: 'quiz' | 'activity' | 'project' | 'discussion'
  questions: AssessmentQuestion[]
  passingScore?: number
}

// Additional supporting types
export interface DialogueCondition {
  type: 'quest' | 'item' | 'relationship' | 'stat' | 'custom'
  check: string
  value: any
}

export interface DialogueResponse {
  id: string
  text: string
  nextNodeId?: string
  conditions?: DialogueCondition[]
}

export interface DialogueAction {
  type: 'giveItem' | 'startQuest' | 'updateRelationship' | 'custom'
  data: any
}

export interface QuestObjective {
  id: string
  description: string
  type: 'location' | 'npc' | 'item' | 'combat' | 'dialogue' | 'custom'
  target: string
  progress: number
  required: number
}

export interface Reward {
  type: 'experience' | 'item' | 'unlock' | 'achievement' | 'card'
  value: any
  description: string
}

export interface ItemProperty {
  name: string
  value: string | number
  type: 'damage' | 'defense' | 'effect' | 'requirement' | 'educational'
}

export interface Chapter {
  id: string
  title: string
  summary: string
  quests: string[]
  keyEvents: string[]
}

export interface AssessmentQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay'
  options?: string[]
  correctAnswer?: string | string[]
  points: number
}

// AI Service Response Types
export interface AIServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}

export interface GeneratedNPC extends NPC {
  generatedAt: Date
  generationPrompt: string
}

export interface GeneratedLocation extends Location {
  generatedAt: Date
  generationPrompt: string
}

export interface GeneratedAdventure extends Adventure {
  generatedAt: Date
  generationPrompt: string
}

export interface TerrainGenerationResponse {
  description: string
  features: string[]
  imageUrl?: string
}
