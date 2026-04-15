import type { MenuItem } from './types'
import {
  defaultFullMenuCatalog,
  type FullMenuCatalog,
} from './fullMenuCatalog'

const LEGACY_GREEN_KEY = 'lily-menu-catalog-v1'
export const FULL_MENU_STORAGE_KEY = 'lily-full-menu-v2'

export function loadFullMenuFromStorage(): FullMenuCatalog | null {
  try {
    const raw = localStorage.getItem(FULL_MENU_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      if (parsed && typeof parsed === 'object') {
        return normalizeFullCatalog(parsed as Record<string, unknown>)
      }
      return null
    }
    const legacy = localStorage.getItem(LEGACY_GREEN_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy) as unknown
      if (Array.isArray(parsed) && parsed.length > 0) {
        const base = defaultFullMenuCatalog()
        base.greenMenu = parsed as MenuItem[]
        return base
      }
    }
  } catch {
    /* ignore */
  }
  return null
}

export function parseFullMenuJson(text: string): FullMenuCatalog | null {
  try {
    const data = JSON.parse(text) as unknown
    if (!data || typeof data !== 'object') return null
    return normalizeFullCatalog(data as Record<string, unknown>)
  } catch {
    return null
  }
}

/** Parse catalog JSON from Firestore or import; returns null if shape is invalid. */
export function parseFullMenuRemote(raw: unknown): FullMenuCatalog | null {
  if (!raw || typeof raw !== 'object') return null
  return normalizeFullCatalog(raw as Record<string, unknown>)
}

function normalizeFullCatalog(raw: Record<string, unknown>): FullMenuCatalog {
  const defaults = defaultFullMenuCatalog()
  const greenMenu = Array.isArray(raw.greenMenu)
    ? (raw.greenMenu as MenuItem[])
    : defaults.greenMenu
  const page2 =
    raw.page2 && typeof raw.page2 === 'object'
      ? {
          ...defaults.page2,
          ...(raw.page2 as FullMenuCatalog['page2']),
        }
      : defaults.page2
  const beverages =
    raw.beverages && typeof raw.beverages === 'object'
      ? {
          ...defaults.beverages,
          ...(raw.beverages as FullMenuCatalog['beverages']),
        }
      : defaults.beverages
  return { greenMenu, page2, beverages }
}

export function saveFullMenuToStorage(catalog: FullMenuCatalog): void {
  localStorage.setItem(FULL_MENU_STORAGE_KEY, JSON.stringify(catalog))
}

export function clearFullMenuStorage(): void {
  localStorage.removeItem(FULL_MENU_STORAGE_KEY)
  localStorage.removeItem(LEGACY_GREEN_KEY)
}
