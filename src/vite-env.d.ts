/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RESTAURANT_NAME?: string
  /** Optional username for #/admin login (client-only). */
  readonly VITE_ADMIN_USERNAME?: string
  /** Optional password for #/admin login (client-only). */
  readonly VITE_ADMIN_PASSWORD?: string
  /** Optional PIN gate for #/admin (client-only; not real security). */
  readonly VITE_ADMIN_PIN?: string
  /** Set to "true" to show the Admin link on the public menu in production builds. */
  readonly VITE_SHOW_ADMIN_LINK?: string
  /** Firebase Web App config (Firestore sync for menu catalog). */
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  /** Firebase Auth user for writing catalog (must exist in Firebase Console). */
  readonly VITE_FIREBASE_ADMIN_EMAIL?: string
  readonly VITE_FIREBASE_ADMIN_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
