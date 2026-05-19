import { initializeApp, getApps } from 'firebase/app'
import type { FirebaseOptions } from 'firebase/app'
import { getDatabase } from 'firebase/database'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig().public

    const firebaseConfig: FirebaseOptions = {
        apiKey: config.firebaseApiKey as string,
        authDomain: config.firebaseAuthDomain as string,
        databaseURL: config.firebaseDatabaseUrl as string,
        projectId: config.firebaseProjectId as string,
        storageBucket: config.firebaseStorageBucket as string,
        messagingSenderId: config.firebaseMessagingSenderId as string,
        appId: config.firebaseAppId as string,
        measurementId: config.firebaseMeasurementId as string | undefined
    }

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    const database = getDatabase(app)

    return {
        provide: {
        firebaseApp: app,
        database
    }
}
})