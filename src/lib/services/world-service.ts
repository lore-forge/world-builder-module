import { db } from '@/lib/firebase/client'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import type { World } from '@/types'

class WorldService {
  private collectionName = 'worlds'

  async createWorld(data: Partial<World>): Promise<World> {
    const worldId = doc(collection(db, this.collectionName)).id
    const world: World = {
      id: worldId,
      name: data.name || 'New World',
      description: data.description || '',
      genre: data.genre || 'fantasy',
      educationalFocus: data.educationalFocus || [],
      creator: data.creator!,
      collaborators: data.collaborators || [data.creator!],
      isPublic: data.isPublic || false,
      maps: [],
      timeline: [],
      cultures: [],
      languages: [],
      metadata: {
        tags: [],
        playCount: 0,
        ...data.metadata,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, this.collectionName, worldId), {
      ...world,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return world
  }

  async getWorld(worldId: string): Promise<World | null> {
    const docRef = doc(db, this.collectionName, worldId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as World
    }

    return null
  }

  async getUserWorlds(userId: string): Promise<World[]> {
    const q = query(
      collection(db, this.collectionName),
      where('creator', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(50)
    )

    const querySnapshot = await getDocs(q)
    const worlds: World[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      worlds.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as World)
    })

    return worlds
  }

  async updateWorld(
    worldId: string,
    updates: Partial<World>,
    userId: string
  ): Promise<World> {
    const worldRef = doc(db, this.collectionName, worldId)
    const world = await this.getWorld(worldId)

    if (!world) {
      throw new Error('World not found')
    }

    if (world.creator !== userId && !world.collaborators.includes(userId)) {
      throw new Error('Access denied')
    }

    await updateDoc(worldRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })

    return {
      ...world,
      ...updates,
      updatedAt: new Date(),
    }
  }

  async deleteWorld(worldId: string, userId: string): Promise<void> {
    const world = await this.getWorld(worldId)

    if (!world) {
      throw new Error('World not found')
    }

    if (world.creator !== userId) {
      throw new Error('Only the creator can delete a world')
    }

    await deleteDoc(doc(db, this.collectionName, worldId))
  }

  async getPublicWorlds(limit = 20): Promise<World[]> {
    const q = query(
      collection(db, this.collectionName),
      where('isPublic', '==', true),
      orderBy('metadata.rating', 'desc'),
      orderBy('updatedAt', 'desc'),
      limit(limit)
    )

    const querySnapshot = await getDocs(q)
    const worlds: World[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      worlds.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as World)
    })

    return worlds
  }
}

export const worldService = new WorldService()
