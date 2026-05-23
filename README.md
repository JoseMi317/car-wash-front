# CarWash Dashboard

Dashboard Nuxt para monitorear el prototipo de CarWash Inteligente del proyecto de Arquitectura de Computadoras.

## Stack

- Nuxt
- Tailwind CSS
- Firebase Realtime Database
- Nuxt server routes for Arduino/ESP32 telemetry

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The local app runs at:

```txt
http://localhost:3000
```

## Environment

Configure `.env` with the Firebase web app values:

```env
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_DATABASE_URL=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Optional API key for Arduino/ESP32 writes:

```env
CARWASH_API_KEY=
```

If `CARWASH_API_KEY` is set, requests to `POST /api/telemetry` must include:

```txt
x-carwash-api-key: <value>
```

## Arduino/ESP32 Endpoint

The board should send telemetry to:

```txt
POST /api/telemetry
```

Local URL:

```txt
http://localhost:3000/api/telemetry
```

Production URL:

```txt
https://<firebase-hosting-domain>/api/telemetry
```

Expected JSON payload:

```json
{
  "status": "washing",
  "phase": "soap",
  "progress": 42,
  "vehiclesServed": 3,
  "cycleTimeSeconds": 38,
  "actuators": {
    "band": true,
    "water": false,
    "soap": true,
    "brushes": false,
    "drying": false,
    "finish": false
  },
  "error": null
}
```

Allowed values:

```txt
status: wait | washing | finished | error
phase: wait | pre-wash | soap | brushes | rinse | drying
```

The server writes:

```txt
carwash/current
carwash/history
```

## Test With Curl

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "status": "washing",
    "phase": "soap",
    "progress": 42,
    "vehiclesServed": 3,
    "cycleTimeSeconds": 38,
    "actuators": {
      "band": true,
      "water": false,
      "soap": true,
      "brushes": false,
      "drying": false,
      "finish": false
    },
    "error": null
  }' \
  "http://localhost:3000/api/telemetry"
```

If `CARWASH_API_KEY` is enabled:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-carwash-api-key: <value>" \
  -d '{ "status": "wait", "phase": "wait", "progress": 0, "vehiclesServed": 0, "cycleTimeSeconds": 0, "actuators": { "band": false, "water": false, "soap": false, "brushes": false, "drying": false, "finish": false }, "error": null }' \
  "http://localhost:3000/api/telemetry"
```

## Arduino HTTP Example

Use only the host in `server`, without `https://`.

```cpp
#include <WiFiS3.h>
#include <ArduinoHttpClient.h>

const char* ssid = "Your_SSID";
const char* pass = "Your_Password";
const char* server = "carwash-arqui2026.web.app";
const int port = 443;

WiFiSSLClient sslClient;
HttpClient client = HttpClient(sslClient, server, port);

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void loop() {
  String payload = "{";
  payload += "\"status\":\"washing\",";
  payload += "\"phase\":\"soap\",";
  payload += "\"progress\":42,";
  payload += "\"vehiclesServed\":3,";
  payload += "\"cycleTimeSeconds\":38,";
  payload += "\"actuators\":{";
  payload += "\"band\":true,";
  payload += "\"water\":false,";
  payload += "\"soap\":true,";
  payload += "\"brushes\":false,";
  payload += "\"drying\":false,";
  payload += "\"finish\":false";
  payload += "},";
  payload += "\"error\":null";
  payload += "}";

  client.beginRequest();
  client.post("/api/telemetry");
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", payload.length());
  // client.sendHeader("x-carwash-api-key", "YOUR_API_KEY");
  client.beginBody();
  client.print(payload);
  client.endRequest();

  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.println("Status: " + String(statusCode));
  Serial.println("Body: " + response);

  delay(10000);
}
```

## Firebase Deploy

Nuxt server routes require a server runtime. Deploying this project to Firebase uses Firebase Hosting + Cloud Functions through the Nuxt Firebase preset.

```bash
npm run deploy
```

Local Firebase emulator:

```bash
npm run emulators
```

Important: deploying server routes to Firebase requires a Firebase plan that supports Cloud Functions/App Hosting.
