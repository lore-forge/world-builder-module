import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase-config';
import type { 
  World, 
  Map, 
  Location, 
  NPC, 
  Campaign,
  CreateWorldInput,
  UpdateWorldInput 
} from '@/types';

// World Collection Operations
export const worldService = {
  // Create a new world
  async createWorld(data: CreateWorldInput, userId: string): Promise<string> {
    const worldRef = doc(collection(db, 'worlds'));
    const worldId = worldRef.id;
    
    const worldData: World = {
      id: worldId,
      name: data.name,
      description: data.description,
      genre: data.genre,
      educationalFocus: data.educationalFocus || [],
      creator: userId,
      collaborators: [],
      isPublic: false,
      maps: [],
      timeline: [],
      cultures: [],
      languages: [],
      metadata: {
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        version: 1,
        tags: data.tags || [],
        featuredImage: null
      }
    };

    await setDoc(worldRef, worldData);
    
    // Update user's world count
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await updateDoc(userRef, {
        'worldBuilderProfile.worldsCreated': (userData.worldBuilderProfile?.worldsCreated || 0) + 1
      });
    }

    return worldId;
  },

  // Get a world by ID
  async getWorld(worldId: string): Promise<World | null> {
    const worldDoc = await getDoc(doc(db, 'worlds', worldId));
    return worldDoc.exists() ? (worldDoc.data() as World) : null;
  },

  // Get all worlds for a user
  async getUserWorlds(userId: string): Promise<World[]> {
    const q = query(
      collection(db, 'worlds'),
      where('creator', '==', userId),
      orderBy('metadata.updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as World);
  },

  // Get public worlds
  async getPublicWorlds(limitCount: number = 20): Promise<World[]> {
    const q = query(
      collection(db, 'worlds'),
      where('isPublic', '==', true),
      orderBy('metadata.updatedAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as World);
  },

  // Update a world
  async updateWorld(worldId: string, updates: UpdateWorldInput): Promise<void> {
    const worldRef = doc(db, 'worlds', worldId);
    await updateDoc(worldRef, {
      ...updates,
      'metadata.updatedAt': serverTimestamp()
    });
  },

  // Delete a world
  async deleteWorld(worldId: string): Promise<void> {
    // Delete all related data (maps, locations, etc.)
    await this.deleteWorldRelatedData(worldId);
    
    // Delete the world document
    await deleteDoc(doc(db, 'worlds', worldId));
  },

  // Helper to delete all related data
  async deleteWorldRelatedData(worldId: string): Promise<void> {
    // Delete maps
    const mapsQuery = query(collection(db, 'maps'), where('worldId', '==', worldId));
    const mapsSnapshot = await getDocs(mapsQuery);
    const deletePromises = mapsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    
    // Delete locations
    const locationsQuery = query(collection(db, 'locations'), where('worldId', '==', worldId));
    const locationsSnapshot = await getDocs(locationsQuery);
    deletePromises.push(...locationsSnapshot.docs.map(doc => deleteDoc(doc.ref)));
    
    // Delete NPCs
    const npcsQuery = query(collection(db, 'npcs'), where('worldId', '==', worldId));
    const npcsSnapshot = await getDocs(npcsQuery);
    deletePromises.push(...npcsSnapshot.docs.map(doc => deleteDoc(doc.ref)));
    
    // Delete campaigns
    const campaignsQuery = query(collection(db, 'campaigns'), where('worldId', '==', worldId));
    const campaignsSnapshot = await getDocs(campaignsQuery);
    deletePromises.push(...campaignsSnapshot.docs.map(doc => deleteDoc(doc.ref)));
    
    await Promise.all(deletePromises);
  },

  // Toggle world public status
  async toggleWorldPublic(worldId: string, isPublic: boolean): Promise<void> {
    const worldRef = doc(db, 'worlds', worldId);
    await updateDoc(worldRef, {
      isPublic,
      'metadata.updatedAt': serverTimestamp()
    });
    
    // Update user's published worlds count if making public
    const worldDoc = await getDoc(worldRef);
    if (worldDoc.exists()) {
      const world = worldDoc.data() as World;
      const userRef = doc(db, 'users', world.creator);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentCount = userData.worldBuilderProfile?.publishedWorlds || 0;
        await updateDoc(userRef, {
          'worldBuilderProfile.publishedWorlds': isPublic ? currentCount + 1 : Math.max(0, currentCount - 1)
        });
      }
    }
  }
};

// Map Collection Operations
export const mapService = {
  async createMap(worldId: string, mapData: Partial<Map>): Promise<string> {
    const mapRef = doc(collection(db, 'maps'));
    const mapId = mapRef.id;
    
    const fullMapData: Map = {
      id: mapId,
      worldId,
      name: mapData.name || 'New Map',
      type: mapData.type || 'overworld',
      dimensions: mapData.dimensions || { width: 1000, height: 1000 },
      layers: [],
      locations: [],
      scale: mapData.scale || 1,
      climate: mapData.climate || {
        temperature: 'temperate',
        humidity: 'moderate',
        season: 'spring'
      }
    };
    
    await setDoc(mapRef, fullMapData);
    
    // Add map reference to world
    const worldRef = doc(db, 'worlds', worldId);
    const worldDoc = await getDoc(worldRef);
    if (worldDoc.exists()) {
      const world = worldDoc.data() as World;
      await updateDoc(worldRef, {
        maps: [...world.maps, mapId],
        'metadata.updatedAt': serverTimestamp()
      });
    }
    
    return mapId;
  },

  async getWorldMaps(worldId: string): Promise<Map[]> {
    const q = query(collection(db, 'maps'), where('worldId', '==', worldId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Map);
  }
};

// Location Collection Operations
export const locationService = {
  async createLocation(mapId: string, locationData: Partial<Location>): Promise<string> {
    const locationRef = doc(collection(db, 'locations'));
    const locationId = locationRef.id;
    
    const fullLocationData: Location = {
      id: locationId,
      mapId,
      name: locationData.name || 'New Location',
      type: locationData.type || 'city',
      coordinates: locationData.coordinates || { x: 0, y: 0 },
      description: locationData.description || '',
      npcs: [],
      items: [],
      quests: [],
      environment: locationData.environment || {
        timeOfDay: 'day',
        weather: 'clear',
        temperature: 20
      },
      images: []
    };
    
    await setDoc(locationRef, fullLocationData);
    
    // Add location reference to map
    const mapRef = doc(db, 'maps', mapId);
    const mapDoc = await getDoc(mapRef);
    if (mapDoc.exists()) {
      const map = mapDoc.data() as Map;
      await updateDoc(mapRef, {
        locations: [...map.locations, locationId]
      });
    }
    
    return locationId;
  },

  async getMapLocations(mapId: string): Promise<Location[]> {
    const q = query(collection(db, 'locations'), where('mapId', '==', mapId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Location);
  }
};

// NPC Collection Operations
export const npcService = {
  async createNPC(worldId: string, npcData: Partial<NPC>): Promise<string> {
    const npcRef = doc(collection(db, 'npcs'));
    const npcId = npcRef.id;
    
    const fullNPCData: NPC = {
      id: npcId,
      worldId,
      name: npcData.name || 'Unnamed NPC',
      race: npcData.race || 'Human',
      occupation: npcData.occupation || 'Commoner',
      personality: npcData.personality || {
        traits: [],
        ideals: [],
        bonds: [],
        flaws: []
      },
      backstory: npcData.backstory || '',
      knowledge: [],
      dialogueTree: [],
      relationships: [],
      imageUrl: npcData.imageUrl
    };
    
    await setDoc(npcRef, fullNPCData);
    return npcId;
  },

  async getWorldNPCs(worldId: string): Promise<NPC[]> {
    const q = query(collection(db, 'npcs'), where('worldId', '==', worldId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as NPC);
  }
};

// Campaign Collection Operations
export const campaignService = {
  async createCampaign(worldId: string, campaignData: Partial<Campaign>): Promise<string> {
    const campaignRef = doc(collection(db, 'campaigns'));
    const campaignId = campaignRef.id;
    
    const fullCampaignData: Campaign = {
      id: campaignId,
      worldId,
      name: campaignData.name || 'New Campaign',
      description: campaignData.description || '',
      storyArcs: [],
      questChains: [],
      educationalObjectives: [],
      sessions: [],
      playerNotes: false,
      gmNotes: ''
    };
    
    await setDoc(campaignRef, fullCampaignData);
    return campaignId;
  },

  async getWorldCampaigns(worldId: string): Promise<Campaign[]> {
    const q = query(collection(db, 'campaigns'), where('worldId', '==', worldId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Campaign);
  }
};
