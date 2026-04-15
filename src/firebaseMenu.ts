import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import type { FullMenuCatalog } from './fullMenuCatalog'
import { parseFullMenuRemote } from './menuCatalogStorage'

const COLLECTION = 'lilySettings'
const DOC_ID = 'fullMenuCatalog'

let appInstance: FirebaseApp | null = null
let firebaseSignInPromise: Promise<void> | null = null

function firebaseConfig() {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY?.trim()
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim()
  const appId = import.meta.env.VITE_FIREBASE_APP_ID?.trim()
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim()
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim()
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim()
  if (!apiKey || !projectId || !appId) return null
  return {
    apiKey,
    authDomain: authDomain ?? `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: storageBucket ?? `${projectId}.appspot.com`,
    messagingSenderId: messagingSenderId ?? '',
    appId,
  }
}

export function isFirebaseMenuConfigured(): boolean {
  return firebaseConfig() !== null
}

function getFirebaseApp(): FirebaseApp {
  if (appInstance) return appInstance
  const cfg = firebaseConfig()
  if (!cfg) {
    throw new Error('Firebase is not configured')
  }
  appInstance = getApps().length ? getApps()[0]! : initializeApp(cfg)
  return appInstance
}

/**
 * Public read: anyone can listen. Writes require Firebase Auth (see ensureFirebaseWriteSession).
 */
export function subscribeMenuCatalog(
  onData: (catalog: FullMenuCatalog) => void,
  onError?: (err: Error) => void
): () => void {
  if (!isFirebaseMenuConfigured()) {
    return () => {}
  }
  const db = getFirestore(getFirebaseApp())
  const ref = doc(db, COLLECTION, DOC_ID)
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) return
      const raw = snap.data()?.catalog
      const parsed = parseFullMenuRemote(raw)
      if (parsed) onData(parsed)
    },
    (err) => onError?.(err as Error)
  )
}

function adminEmailForFirebase(): string | undefined {
  const direct = import.meta.env.VITE_FIREBASE_ADMIN_EMAIL?.trim()
  if (direct) return direct
  const user = import.meta.env.VITE_ADMIN_USERNAME?.trim()
  if (user?.includes('@')) return user
  return undefined
}

function adminPasswordForFirebase(): string | undefined {
  const direct = import.meta.env.VITE_FIREBASE_ADMIN_PASSWORD?.trim()
  if (direct) return direct
  return import.meta.env.VITE_ADMIN_PASSWORD?.trim()
}

/**
 * Signs in with Email/Password so Firestore rules can allow writes to authenticated users.
 * Call after the in-app admin gate succeeds, or it will run lazily before the first cloud save.
 */
export async function ensureFirebaseWriteSession(): Promise<void> {
  if (!isFirebaseMenuConfigured()) return
  const auth = getAuth(getFirebaseApp())
  if (auth.currentUser) return

  const email = adminEmailForFirebase()
  const password = adminPasswordForFirebase()
  if (!email || !password) {
    console.warn(
      '[Lily] Firebase: set VITE_FIREBASE_ADMIN_EMAIL and VITE_FIREBASE_ADMIN_PASSWORD (or use VITE_ADMIN_* with an email-shaped username) to enable cloud saves.'
    )
    return
  }

  if (!firebaseSignInPromise) {
    firebaseSignInPromise = signInWithEmailAndPassword(auth, email, password)
      .then(() => {})
      .finally(() => {
        firebaseSignInPromise = null
      })
  }
  return firebaseSignInPromise
}

export type SaveMenuCatalogCloudOptions = {
  /** If true, throws when Firebase is configured but sign-in or write fails (explicit Save). */
  strict?: boolean
}

function stripUndefined(value: unknown): unknown {
  if (value === undefined) return null
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item))
  }
  if (value && typeof value === 'object') {
    const src = value as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(src)) {
      const next = stripUndefined(entry)
      if (next !== undefined) out[key] = next
    }
    return out
  }
  return value
}

export async function saveMenuCatalogToCloud(
  catalog: FullMenuCatalog,
  options?: SaveMenuCatalogCloudOptions
): Promise<void> {
  if (!isFirebaseMenuConfigured()) return
  await ensureFirebaseWriteSession()
  const auth = getAuth(getFirebaseApp())
  if (!auth.currentUser) {
    const msg =
      'Could not sign in to Firebase. Check VITE_FIREBASE_ADMIN_EMAIL / PASSWORD (or an email-shaped VITE_ADMIN_USERNAME) matches a user in Firebase Authentication.'
    if (options?.strict) throw new Error(msg)
    console.warn('[Lily] Firebase: skipped cloud save (not signed in).', msg)
    return
  }
  const db = getFirestore(getFirebaseApp())
  const ref = doc(db, COLLECTION, DOC_ID)
  const safeCatalog = stripUndefined(catalog)
  await setDoc(ref, {
    catalog: safeCatalog,
    updatedAt: serverTimestamp(),
  })
}
