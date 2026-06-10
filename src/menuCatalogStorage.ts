import type { BeverageRow, BevSimpleLine } from './beveragesMenuData'
import type { MenuItem } from './types'
import {
  defaultFullMenuCatalog,
  type FullMenuCatalog,
} from './fullMenuCatalog'

const REMOVED_PAGE2_ITEM_IDS = new Set(['w6', 'w10'])

type LegacyBeverageRow = {
  id: string
  name: string
  price?: number
  small?: number
  medium?: number
  large?: number
}

function hasSizedPrices(row: LegacyBeverageRow): boolean {
  return (
    typeof row.small === 'number' ||
    typeof row.medium === 'number' ||
    typeof row.large === 'number'
  )
}

function normalizeSizedBeverageRows(
  rows: unknown,
  fallback: BeverageRow[]
): BeverageRow[] {
  if (!Array.isArray(rows)) return fallback
  return rows.map((row) => {
    const legacy = row as LegacyBeverageRow
    if (hasSizedPrices(legacy)) {
      return {
        id: legacy.id,
        name: legacy.name,
        small: legacy.small,
        medium: legacy.medium,
        large: legacy.large,
      }
    }
    if (typeof legacy.price === 'number') {
      return { id: legacy.id, name: legacy.name, medium: legacy.price }
    }
    return { id: legacy.id, name: legacy.name }
  })
}

function normalizeSimpleBeverageRows(
  rows: unknown,
  fallback: BevSimpleLine[]
): BevSimpleLine[] {
  if (!Array.isArray(rows)) return fallback
  return rows.map((row) => {
    const legacy = row as LegacyBeverageRow
    const price =
      typeof legacy.price === 'number'
        ? legacy.price
        : legacy.medium ?? legacy.small ?? legacy.large ?? 0
    return { id: legacy.id, name: legacy.name, price }
  })
}

function filterRemovedPage2Items<T extends { id: string }>(rows: T[]): T[] {
  return rows.filter((row) => !REMOVED_PAGE2_ITEM_IDS.has(row.id))
}

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
        return normalizeFullCatalog({
          greenMenu: parsed as MenuItem[],
          page2: base.page2,
          beverages: base.beverages,
        })
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

/** Append default menu rows whose `id` is missing, unless the user removed that default row. */
function mergeMissingGreenItemsFromDefaults(
  stored: MenuItem[],
  userRemovedDefaultIds: ReadonlySet<string>
): MenuItem[] {
  const defaults = defaultFullMenuCatalog().greenMenu
  const ids = new Set(stored.map((i) => i.id))
  const merged: MenuItem[] = [...stored]
  for (const item of defaults) {
    if (ids.has(item.id) || userRemovedDefaultIds.has(item.id)) continue
    merged.push({ ...item })
    ids.add(item.id)
  }
  merged.sort((a, b) => {
    const oa = a.sortOrder ?? 0
    const ob = b.sortOrder ?? 0
    if (oa !== ob) return oa - ob
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  })
  return merged
}

/** Map legacy saved category labels to current names (localStorage / Firestore). */
const LEGACY_GREEN_CATEGORY_RENAME: Record<string, string> = {
  'AL FORNO': 'MANAKISH',
  'PATTY MELT': 'EGG',
}

function renameLegacyGreenCategories(items: MenuItem[]): MenuItem[] {
  return items.map((item) => {
    const next = LEGACY_GREEN_CATEGORY_RENAME[item.category]
    if (!next) return item
    return { ...item, category: next }
  })
}

function normalizeFullCatalog(raw: Record<string, unknown>): FullMenuCatalog {
  const defaults = defaultFullMenuCatalog()
  const greenMenuRaw = Array.isArray(raw.greenMenu)
    ? (raw.greenMenu as MenuItem[])
    : defaults.greenMenu
  const removedGreenItemIds = Array.isArray(raw.removedGreenItemIds)
    ? (raw.removedGreenItemIds as string[])
    : []
  const removedSet = new Set(removedGreenItemIds)
  const greenMenu = renameLegacyGreenCategories(
    mergeMissingGreenItemsFromDefaults(greenMenuRaw, removedSet)
  )
  const page2Raw =
    raw.page2 && typeof raw.page2 === 'object'
      ? {
          ...defaults.page2,
          ...(raw.page2 as FullMenuCatalog['page2']),
        }
      : defaults.page2
  const page2 = {
    ...page2Raw,
    startersRight: filterRemovedPage2Items(
      Array.isArray(page2Raw.startersRight)
        ? page2Raw.startersRight
        : defaults.page2.startersRight
    ),
    // Ensure newly added sections survive older/malformed saved catalogs.
    crepe: Array.isArray(page2Raw.crepe) ? page2Raw.crepe : defaults.page2.crepe,
  }
  const beveragesRaw =
    raw.beverages && typeof raw.beverages === 'object'
      ? (raw.beverages as FullMenuCatalog['beverages'])
      : defaults.beverages
  const beverages = {
    blackCoffee: normalizeSizedBeverageRows(
      beveragesRaw.blackCoffee,
      defaults.beverages.blackCoffee
    ),
    hot: normalizeSizedBeverageRows(beveragesRaw.hot, defaults.beverages.hot),
    blended: normalizeSizedBeverageRows(
      beveragesRaw.blended,
      defaults.beverages.blended
    ),
    iced: normalizeSizedBeverageRows(beveragesRaw.iced, defaults.beverages.iced),
    drinks: normalizeSimpleBeverageRows(
      beveragesRaw.drinks,
      defaults.beverages.drinks
    ),
    nargileh: normalizeSimpleBeverageRows(
      beveragesRaw.nargileh,
      defaults.beverages.nargileh
    ),
  }
  return {
    greenMenu,
    page2,
    beverages,
    removedGreenItemIds,
  }
}

export function saveFullMenuToStorage(catalog: FullMenuCatalog): void {
  localStorage.setItem(FULL_MENU_STORAGE_KEY, JSON.stringify(catalog))
}

export function clearFullMenuStorage(): void {
  localStorage.removeItem(FULL_MENU_STORAGE_KEY)
  localStorage.removeItem(LEGACY_GREEN_KEY)
}
