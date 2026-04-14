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
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
