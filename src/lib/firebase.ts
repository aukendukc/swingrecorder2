import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missing.length) {
  throw new Error(
    `Firebase設定が不足しています: ${missing.join(', ')}。` +
      ` swingrecorder-web に .env.local を作り、NEXT_PUBLIC_FIREBASE_* を設定してから next dev を再起動してください。`,
  )
}

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const firebaseProjectId = firebaseConfig.projectId as string
export const firebaseApiKey = firebaseConfig.apiKey as string

