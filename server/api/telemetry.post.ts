import { getFirebaseAdminDatabase } from '../utils/firebase-admin'
import { normalizeTelemetryPayload } from '../utils/telemetry'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const configuredApiKey = config.carwashApiKey

  if (configuredApiKey) {
    const providedApiKey = getHeader(event, 'x-carwash-api-key') ?? getQuery(event).apiKey

    if (providedApiKey !== configuredApiKey) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid API key'
      })
    }
  }

  const body = await readBody(event)
  const telemetry = normalizeTelemetryPayload(body)
  const database = getFirebaseAdminDatabase()

  const historyRef = database.ref('carwash/history').push()

  await Promise.all([
    database.ref('carwash/current').set(telemetry),
    historyRef.set({
      event: 'telemetry_received',
      status: telemetry.status,
      phase: telemetry.phase,
      cycleTimeSeconds: telemetry.cycleTimeSeconds,
      createdAt: telemetry.updatedAt
    })
  ])

  setResponseStatus(event, 201)

  return {
    ok: true,
    currentPath: 'carwash/current',
    historyId: historyRef.key,
    telemetry
  }
})
