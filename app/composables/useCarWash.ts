import type { Database } from 'firebase/database'
import { onValue, push, ref as dbRef, set, serverTimestamp } from 'firebase/database'

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
    const loading = useState('carwash-loading', () => true)
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
            createdAt: serverTimestamp()
        })
    }

    return {
        current,
        loading,
        error,
        listenCurrentState,
        updateCurrentState,
        sendDemoState
    }
}