import type { Database } from 'firebase/database'
import {
  limitToLast,
  onValue,
  push,
  query,
  ref as dbRef,
  serverTimestamp,
  set
} from 'firebase/database'

type Actuators = {
  band: boolean
  water: boolean
  soap: boolean
  brushes: boolean
  drying: boolean
  finish: boolean
}

export type CarWashState = {
  status: 'wait' | 'washing' | 'finished' | 'error'
  phase: 'wait' | 'pre-wash' | 'soap' | 'brushes' | 'rinse' | 'drying'
  progress: number
  vehiclesServed: number
  cycleTimeSeconds: number
  actuators: Actuators
  error: string | null
  updatedAt?: number
}

export type CarWashHistoryEvent = {
  id: string
  event: string
  status?: CarWashState['status']
  phase?: CarWashState['phase']
  cycleTimeSeconds?: number
  createdAt?: number
}

const defaultState: CarWashState = {
  status: 'wait',
  phase: 'wait',
  progress: 0,
  vehiclesServed: 0,
  cycleTimeSeconds: 0,
  actuators: {
    band: false,
    water: false,
    soap: false,
    brushes: false,
    drying: false,
    finish: false
  },
  error: null
}

export const useCarWash = () => {
  const current = useState<CarWashState>('carwash-current', () => defaultState)
  const history = useState<CarWashHistoryEvent[]>('carwash-history', () => [])
  const loading = useState('carwash-loading', () => true)
  const historyLoading = useState('carwash-history-loading', () => true)
  const error = useState<string | null>('carwash-error', () => null)

  const { $database } = useNuxtApp()
  const database = $database as Database

  const listenCurrentState = () => {
    const currentRef = dbRef(database, 'carwash/current')

    return onValue(
      currentRef,
      (snapshot) => {
        current.value = snapshot.exists()
          ? { ...defaultState, ...snapshot.val() }
          : defaultState

        loading.value = false
        error.value = null
      },
      (firebaseError) => {
        error.value = firebaseError.message
        loading.value = false
      }
    )
  }

  const listenHistory = (limit = 20) => {
    const historyRef = query(dbRef(database, 'carwash/history'), limitToLast(limit))

    return onValue(
      historyRef,
      (snapshot) => {
        const value = snapshot.val() as Record<string, Omit<CarWashHistoryEvent, 'id'>> | null

        history.value = value
          ? Object.entries(value)
              .map(([id, event]) => ({ id, ...event }))
              .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
          : []

        historyLoading.value = false
      },
      (firebaseError) => {
        error.value = firebaseError.message
        historyLoading.value = false
      }
    )
  }

  const updateCurrentState = async (payload: Partial<CarWashState>) => {
    await set(dbRef(database, 'carwash/current'), {
      ...current.value,
      ...payload,
      updatedAt: Date.now()
    })
  }

  const sendDemoState = async () => {
    const demoState: CarWashState = {
      status: 'washing',
      phase: 'soap',
      progress: 42,
      vehiclesServed: 3,
      cycleTimeSeconds: 38,
      actuators: {
        band: true,
        water: false,
        soap: true,
        brushes: false,
        drying: false,
        finish: false
      },
      error: null,
      updatedAt: Date.now()
    }

    await set(dbRef(database, 'carwash/current'), demoState)

    await push(dbRef(database, 'carwash/history'), {
      event: 'demo_state_sent',
      phase: demoState.phase,
      status: demoState.status,
      cycleTimeSeconds: demoState.cycleTimeSeconds,
      createdAt: serverTimestamp()
    })
  }

  return {
    current,
    history,
    loading,
    historyLoading,
    error,
    listenCurrentState,
    listenHistory,
    updateCurrentState,
    sendDemoState
  }
}
