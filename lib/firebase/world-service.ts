import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase-client'
import { v4 as uuidv4 } from 'uuid'

export interface World {
  id: string
  name: string
  description: string
  genre: 'fantasy' | 'scifi' | 'historical' | 'educational' | 'custom'
  setting?: string
  isPublic: boolean
  creator: string
  collaborators: string[]
  maps: string[]
  campaigns: string[]
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  imageUrl?: string
  tags?: string[]
}

export class WorldService {
  private collectionName = 'worlds'

  async createWorld(worldData: Omit<World, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<World> {
    try {
      const newWorld = {
        ...worldData,
        creator: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        maps: [],
        campaigns: [],
      }

      const docRef = await addDoc(collection(db, this.collectionName), newWorld)
      return {
        ...newWorld,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as World
    } catch (error) {
      console.error('Error creating world:', error)
      throw error
    }
  }

  async getWorld(worldId: string): Promise<World | null> {
    try {
      const docRef = doc(db, this.collectionName, worldId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as World
      }
      
      return null
    } catch (error) {
      console.error('Error getting world:', error)
      throw error
    }
  }

  async getUserWorlds(userId: string): Promise<World[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('creator', '==', userId),
        orderBy('updatedAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as World))
    } catch (error) {
      console.error('Error getting user worlds:', error)
      throw error
    }
  }

  async getPublicWorlds(limit: number = 20): Promise<World[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('isPublic', '==', true),
        orderBy('updatedAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.slice(0, limit).map(doc => ({
        id: doc.id,
        ...doc.data()
      } as World))
    } catch (error) {
      console.error('Error getting public worlds:', error)
      throw error
    }
  }

  async updateWorld(worldId: string, updates: Partial<World>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, worldId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating world:', error)
      throw error
    }
  }

  async deleteWorld(worldId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, worldId))
    } catch (error) {
      console.error('Error deleting world:', error)
      throw error
    }
  }

  async addCollaborator(worldId: string, userId: string): Promise<void> {
    try {
      const world = await this.getWorld(worldId)
      if (!world) throw new Error('World not found')
      
      if (!world.collaborators.includes(userId)) {
        await this.updateWorld(worldId, {
          collaborators: [...world.collaborators, userId]
        })
      }
    } catch (error) {
      console.error('Error adding collaborator:', error)
      throw error
    }
  }
}

export const worldService = new WorldService()
