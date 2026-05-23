type Status = 'wait' | 'washing' | 'finished' | 'error'
type Phase = 'wait' | 'pre-wash' | 'soap' | 'brushes' | 'rinse' | 'drying'

type RawTelemetryPayload = {
  status?: unknown
  phase?: unknown
  progress?: unknown
  vehiclesServed?: unknown
  cycleTimeSeconds?: unknown
  actuators?: Partial<Record<'band' | 'water' | 'soap' | 'brushes' | 'drying' | 'finish', unknown>>
  error?: unknown
}

export type TelemetryPayload = {
  status: Status
  phase: Phase
  progress: number
  vehiclesServed: number
  cycleTimeSeconds: number
  actuators: {
    band: boolean
    water: boolean
    soap: boolean
    brushes: boolean
    drying: boolean
    finish: boolean
  }
  error: string | null
  updatedAt: number
}

const statuses: Status[] = ['wait', 'washing', 'finished', 'error']
const phases: Phase[] = ['wait', 'pre-wash', 'soap', 'brushes', 'rinse', 'drying']

const toNumber = (value: unknown, fallback = 0) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value))
}

const toBoolean = (value: unknown) => {
  return value === true || value === 'true' || value === 1 || value === '1'
}

const validateEnum = <T extends string>(value: unknown, allowed: T[], field: string): T => {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid ${field}`
    })
  }

  return value as T
}

export const normalizeTelemetryPayload = (payload: RawTelemetryPayload): TelemetryPayload => {
  if (!payload || typeof payload !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'JSON body is required'
    })
  }

  const actuators = payload.actuators ?? {}

  return {
    status: validateEnum(payload.status, statuses, 'status'),
    phase: validateEnum(payload.phase, phases, 'phase'),
    progress: clamp(Math.round(toNumber(payload.progress)), 0, 100),
    vehiclesServed: Math.max(0, Math.round(toNumber(payload.vehiclesServed))),
    cycleTimeSeconds: Math.max(0, Math.round(toNumber(payload.cycleTimeSeconds))),
    actuators: {
      band: toBoolean(actuators.band),
      water: toBoolean(actuators.water),
      soap: toBoolean(actuators.soap),
      brushes: toBoolean(actuators.brushes),
      drying: toBoolean(actuators.drying),
      finish: toBoolean(actuators.finish)
    },
    error: typeof payload.error === 'string' && payload.error.trim()
      ? payload.error.trim()
      : null,
    updatedAt: Date.now()
  }
}
