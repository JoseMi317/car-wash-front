import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

export const getFirebaseAdminDatabase = () => {
  const config = useRuntimeConfig()

  if (!getApps().length) {
    initializeApp({
      credential: applicationDefault(),
      databaseURL: config.public.firebaseDatabaseUrl
    })
  }

  return getDatabase()
}
