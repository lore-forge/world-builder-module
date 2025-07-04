# World Builder API Documentation

## Base URL

Development: `http://localhost:3003/api`  
Production: `https://world-builder.rpg-immersive.com/api`

## Authentication

All API endpoints require authentication via Firebase Auth. Include the ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## Endpoints

### Worlds

#### List User Worlds
```http
GET /worlds
```

**Response:**
```json
{
  "worlds": [
    {
      "id": "world123",
      "name": "Fantasy Realm",
      "description": "A magical world of adventure",
      "genre": "fantasy",
      "isPublic": true,
      "creator": "user123",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  ]
}
```

#### Create World
```http
POST /worlds
```

**Request Body:**
```json
{
  "name": "New World",
  "description": "Description of the world",
  "genre": "fantasy",
  "educationalFocus": ["history", "geography"],
  "isPublic": false
}
```

**Response:**
```json
{
  "world": {
    "id": "world123",
    "name": "New World",
    "description": "Description of the world",
    "genre": "fantasy",
    "educationalFocus": ["history", "geography"],
    "creator": "user123",
    "collaborators": ["user123"],
    "isPublic": false,
    "maps": [],
    "timeline": [],
    "cultures": [],
    "languages": [],
    "metadata": {
      "tags": [],
      "playCount": 0
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### Get World Details
```http
GET /worlds/{worldId}
```

**Response:**
```json
{
  "world": {
    "id": "world123",
    "name": "Fantasy Realm",
    "description": "A magical world of adventure",
    "genre": "fantasy",
    "creator": "user123",
    "collaborators": ["user123", "user456"],
    "isPublic": true,
    "maps": [...],
    "timeline": [...],
    "cultures": [...],
    "languages": [...],
    "metadata": {...},
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-02T00:00:00Z"
  }
}
```

#### Update World
```http
PUT /worlds/{worldId}
```

**Request Body:**
```json
{
  "name": "Updated World Name",
  "description": "Updated description",
  "isPublic": true,
  "metadata": {
    "tags": ["adventure", "educational"]
  }
}
```

**Response:**
```json
{
  "world": {
    "id": "world123",
    "name": "Updated World Name",
    "description": "Updated description",
    ...
  }
}
```

#### Delete World
```http
DELETE /worlds/{worldId}
```

**Response:**
```json
{
  "success": true
}
```

### Maps (Coming Soon)

#### Create Map
```http
POST /worlds/{worldId}/maps
```

#### Update Map
```http
PUT /worlds/{worldId}/maps/{mapId}
```

#### Delete Map
```http
DELETE /worlds/{worldId}/maps/{mapId}
```

### Locations (Coming Soon)

#### Create Location
```http
POST /worlds/{worldId}/maps/{mapId}/locations
```

#### Update Location
```http
PUT /worlds/{worldId}/maps/{mapId}/locations/{locationId}
```

#### Delete Location
```http
DELETE /worlds/{worldId}/maps/{mapId}/locations/{locationId}
```

### NPCs (Coming Soon)

#### Create NPC
```http
POST /worlds/{worldId}/npcs
```

#### Update NPC
```http
PUT /worlds/{worldId}/npcs/{npcId}
```

#### Delete NPC
```http
DELETE /worlds/{worldId}/npcs/{npcId}
```

### Campaigns (Coming Soon)

#### Create Campaign
```http
POST /worlds/{worldId}/campaigns
```

#### Update Campaign
```http
PUT /worlds/{worldId}/campaigns/{campaignId}
```

#### Delete Campaign
```http
DELETE /worlds/{worldId}/campaigns/{campaignId}
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200 OK` - Successful request
- `201 Created` - Successfully created resource
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Access denied to resource
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "error": "Error message describing what went wrong"
}
```

## Rate Limiting

- Standard endpoints: 100 requests per minute
- AI generation endpoints: 10 requests per minute
- File upload endpoints: 20 requests per minute

## Webhooks (Coming Soon)

Webhooks will be available for:
- World published
- Collaborator added
- Campaign completed
- Achievement unlocked

## Cross-Module Integration (Coming Soon)

### RPG Module Integration
```http
POST /integration/rpg/import-world
POST /integration/rpg/spawn-npc/{npcId}
```

### TCG Module Integration
```http
POST /integration/tcg/link-card/{cardId}/location/{locationId}
POST /integration/tcg/create-trader/{npcId}
```
