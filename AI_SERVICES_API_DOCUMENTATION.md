# AI Services API Documentation

## Overview

The Lore Forge AI Services provide centralized AI-powered functionality for RPG, TCG, and game development applications. This document provides comprehensive input-output specifications for integrating these services into different modules and repositories.

## Base URLs

| Environment | URL |
|------------|-----|
| Production | `https://us-central1-gen-lang-client-0780430254.cloudfunctions.net` |

## Available Endpoints

### 1. Health Check
**Endpoint:** `GET /ai-services-health`

**Description:** Check the status and availability of AI services.

**Request:**
```http
GET /ai-services-health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-06T08:33:58.840Z",
  "version": "0.1.0",
  "services": ["character", "voice"],
  "caching": "disabled"
}
```

**Response Fields:**
- `status`: `"healthy"` | `"unhealthy"`
- `timestamp`: ISO 8601 timestamp
- `version`: API version
- `services`: Array of available services
- `caching`: Cache status

---

### 2. Main AI Services Endpoint
**Endpoint:** `POST /ai-services`

**Description:** Main endpoint for all AI services. Supports character generation and voice synthesis.

#### 2.1 Character Generation

**Request:**
```http
POST /ai-services
Content-Type: application/json

{
  "service": "character",
  "operation": "create",
  "data": {
    "prompt": "Create a brave elven archer with a mysterious past"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": "{\"personaje_creado\": {\"informacion_basica\": {\"nombre_sugerido\": \"Aerion Swiftarrow\", \"titulo_o_apodo\": \"El Ojo de Halcón\", \"edad\": \"215\", \"genero\": \"Masculino\", \"raza_sugerida\": \"Elfo Silvano\", \"origen_geografico\": \"Bosque de Eldoria\"}, \"arquetipo\": \"Arquero/Explorador\", \"trasfondo\": {...}, \"personalidad\": {...}, \"atributos_base\": {...}, \"habilidades_competentes\": [...], \"equipo_inicial\": {...}, \"ganchos_narrativos\": {...}}}",
  "service": "character",
  "operation": "create",
  "timestamp": "2025-07-06T07:45:43.833Z"
}
```

**Character Data Structure (JSON string in data field):**
```json
{
  "personaje_creado": {
    "informacion_basica": {
      "nombre_sugerido": "string",
      "titulo_o_apodo": "string", 
      "edad": "string",
      "genero": "string",
      "raza_sugerida": "string",
      "origen_geografico": "string"
    },
    "arquetipo": "string",
    "trasfondo": {
      "historia_personal": "string",
      "evento_definitorio": "string", 
      "familia_y_conexiones": "string",
      "secreto_o_misterio": "string"
    },
    "personalidad": {
      "rasgos_principales": ["string"],
      "motivaciones": "string",
      "miedos_o_debilidades": "string",
      "quirks_o_manias": "string"
    },
    "atributos_base": {
      "Fuerza": number,
      "Agilidad": number,
      "Resistencia": number,
      "Intelecto": number,
      "Percepcion": number,
      "Presencia": number
    },
    "habilidades_competentes": ["string"],
    "equipo_inicial": {
      "arma_principal": "string",
      "armadura_o_proteccion": "string",
      "herramientas_especiales": ["string"],
      "objetos_personales": ["string"]
    },
    "ganchos_narrativos": {
      "enemigo_o_rival": "string",
      "aliado_o_mentor": "string", 
      "objetivo_personal": "string",
      "conflicto_interno": "string"
    },
    "descripcion_fisica": "string",
    "notas_de_interpretacion": "string",
    "prompt_descripcion_completa": "string"
  }
}
```

#### 2.2 Voice Generation

**Request:**
```http
POST /ai-services
Content-Type: application/json

{
  "service": "voice",
  "operation": "generate", 
  "data": {
    "text": "Hola, soy un valiente guerrero elfo",
    "voiceConfig": {
      "languageCode": "es-ES",
      "voiceName": "es-ES-Standard-A",
      "characterId": "narrator",
      "emotion": "neutral"
    }
  }
}
```

**Voice Configuration Options:**
- `languageCode`: Language code (e.g., "es-ES", "en-US")
- `voiceName`: Specific voice name (optional if using characterId)
- `characterId`: Predefined character voice (optional)
  - `"narrator"`: Deep, authoritative voice
  - `"merchant"`: Friendly, commercial voice  
  - `"sage"`: Deep, thoughtful voice
  - `"mysterious"`: Enigmatic, whispery voice
  - `"companion"`: Upbeat, enthusiastic voice
- `emotion`: Emotion for character voices
  - `"neutral"`, `"dramatic"`, `"mysterious"`, `"excited"`, etc.

**Response:**
```json
{
  "success": true,
  "data": "data:audio/mp3;base64,//OExAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA...",
  "service": "voice", 
  "operation": "generate",
  "timestamp": "2025-07-06T08:15:08.482Z"
}
```

**Response Fields:**
- `data`: Base64-encoded MP3 audio data URL (can be used directly in HTML audio elements)

---

### 3. Dedicated Character Generation
**Endpoint:** `POST /ai-services-character`

**Description:** Dedicated endpoint for character generation only.

**Request:**
```http
POST /ai-services-character
Content-Type: application/json

{
  "prompt": "Create a wise wizard character",
  "cached": true
}
```

**Response:** Same structure as character generation via main endpoint.

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "timestamp": "2025-07-06T08:15:08.482Z"
}
```

**Common Error Codes:**
- `VALIDATION_ERROR`: Invalid input parameters
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable
- `AUTHENTICATION_ERROR`: Authentication failed
- `RATE_LIMIT_EXCEEDED`: Too many requests

**HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized 
- `429`: Too Many Requests
- `500`: Internal Server Error

---

## Integration Examples

### JavaScript/TypeScript

```typescript
// Character Generation
async function generateCharacter(prompt: string) {
  const response = await fetch('https://us-central1-gen-lang-client-0780430254.cloudfunctions.net/ai-services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service: 'character',
      operation: 'create',
      data: { prompt }
    })
  });
  
  const result = await response.json();
  if (result.success) {
    return JSON.parse(result.data);
  }
  throw new Error(result.error);
}

// Voice Generation
async function generateVoice(text: string, voiceConfig = {}) {
  const response = await fetch('https://us-central1-gen-lang-client-0780430254.cloudfunctions.net/ai-services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service: 'voice',
      operation: 'generate',
      data: { text, voiceConfig }
    })
  });
  
  const result = await response.json();
  if (result.success) {
    return result.data; // Base64 audio data URL
  }
  throw new Error(result.error);
}

// Health Check
async function checkHealth() {
  const response = await fetch('https://us-central1-gen-lang-client-0780430254.cloudfunctions.net/ai-services-health');
  return await response.json();
}
```

### Python

```python
import requests
import json

class AIServicesClient:
    def __init__(self):
        self.base_url = "https://us-central1-gen-lang-client-0780430254.cloudfunctions.net"
    
    def generate_character(self, prompt):
        response = requests.post(
            f"{self.base_url}/ai-services",
            json={
                "service": "character",
                "operation": "create", 
                "data": {"prompt": prompt}
            }
        )
        result = response.json()
        if result["success"]:
            return json.loads(result["data"])
        raise Exception(result["error"])
    
    def generate_voice(self, text, voice_config=None):
        response = requests.post(
            f"{self.base_url}/ai-services",
            json={
                "service": "voice",
                "operation": "generate",
                "data": {"text": text, "voiceConfig": voice_config or {}}
            }
        )
        result = response.json()
        if result["success"]:
            return result["data"]  # Base64 audio data URL
        raise Exception(result["error"])
    
    def check_health(self):
        response = requests.get(f"{self.base_url}/ai-services-health")
        return response.json()
```

### cURL Examples

```bash
# Health Check
curl https://us-central1-gen-lang-client-0780430254.cloudfunctions.net/ai-services-health

# Character Generation
curl -X POST https://us-central1-gen-lang-client-0780430254.cloudfunctions.net/ai-services \
  -H "Content-Type: application/json" \
  -d '{
    "service": "character",
    "operation": "create",
    "data": {
      "prompt": "Create a brave warrior character"
    }
  }'

# Voice Generation  
curl -X POST https://us-central1-gen-lang-client-0780430254.cloudfunctions.net/ai-services \
  -H "Content-Type: application/json" \
  -d '{
    "service": "voice", 
    "operation": "generate",
    "data": {
      "text": "Hola mundo",
      "voiceConfig": {
        "languageCode": "es-ES"
      }
    }
  }'
```

---

## Rate Limits

- **Character Generation**: 10 requests per minute per IP
- **Voice Generation**: 20 requests per minute per IP  
- **Health Check**: 100 requests per minute per IP

---

## Storage Buckets

The services use the following Google Cloud Storage buckets:

| Bucket | Purpose | URL |
|--------|---------|-----|
| `rpg_image_bucket` | Image storage | https://console.cloud.google.com/storage/browser/rpg_image_bucket |
| `rpg-audio-bucket` | Audio storage | https://console.cloud.google.com/storage/browser/rpg-audio-bucket |
| `aiservices_bucket` | Characters, maps, etc. | https://console.cloud.google.com/storage/browser/aiservices_bucket |

---

## Authentication

The services currently allow unauthenticated access. For production use in different modules:

1. **No authentication required** for the current endpoints
2. **CORS enabled** for cross-origin requests
3. **Rate limiting** applied per IP address

---

## Best Practices

### 1. Error Handling
Always check the `success` field before processing results:

```typescript
if (result.success) {
  // Process result.data
} else {
  // Handle result.error
}
```

### 2. Audio Handling
Voice generation returns base64 data URLs that can be used directly:

```typescript
const audioDataUrl = await generateVoice("Hello world");
const audio = new Audio(audioDataUrl);
audio.play();
```

### 3. Character Data Parsing
Character data is returned as a JSON string, remember to parse it:

```typescript
const character = JSON.parse(result.data);
const characterName = character.personaje_creado.informacion_basica.nombre_sugerido;
```

### 4. Health Monitoring
Implement health checks in your applications:

```typescript
setInterval(async () => {
  const health = await checkHealth();
  if (health.status !== 'healthy') {
    console.warn('AI Services unhealthy:', health);
  }
}, 60000); // Check every minute
```

---

## Support and Troubleshooting

- **Service Status**: Use the health endpoint to check service availability
- **Error Logs**: Check Google Cloud Function logs for detailed error information
- **Rate Limits**: Implement exponential backoff for rate limit errors
- **Timeouts**: Character generation can take 10-30 seconds, voice generation 2-5 seconds