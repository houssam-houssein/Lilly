import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { BeveragesCatalog, FullMenuCatalog, Page2Catalog } from './fullMenuCatalog'
import { defaultFullMenuCatalog } from './fullMenuCatalog'
import {
  isFirebaseMenuConfigured,
  saveMenuCatalogToCloud,
  subscribeMenuCatalog,
} from './firebaseMenu'
import {
  clearFullMenuStorage,
  loadFullMenuFromStorage,
  saveFullMenuToStorage,
} from './menuCatalogStorage'
import type { MenuItem } from './types'

const CLOUD_SAVE_DEBOUNCE_MS = 2000

function groupByCategory(items: MenuItem[]): Map<string, MenuItem[]> {
  const map = new Map<string, MenuItem[]>()
  for (const item of items) {
    const list = map.get(item.category)
    if (list) list.push(item)
    else map.set(item.category, [item])
  }
  return map
}

function getInitialCatalog(): FullMenuCatalog {
  return loadFullMenuFromStorage() ?? defaultFullMenuCatalog()
}

export type MenuCatalogContextValue = {
  catalog: FullMenuCatalog
  greenByCategory: Map<string, MenuItem[]>
  setGreenMenu: (
    updater: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])
  ) => void
  setPage2: (
    updater: Page2Catalog | ((prev: Page2Catalog) => Page2Catalog)
  ) => void
  setBeverages: (
    updater:
      | BeveragesCatalog
      | ((prev: BeveragesCatalog) => BeveragesCatalog)
  ) => void
  setFullCatalog: (catalog: FullMenuCatalog) => void
  resetAllToDefaults: () => void
  /** Flush localStorage immediately; if Firebase is configured, upload now (throws on failure in strict mode). */
  saveChangesNow: () => Promise<void>
}

const MenuCatalogContext = createContext<MenuCatalogContextValue | null>(null)

export function MenuCatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalogState] = useState<FullMenuCatalog>(getInitialCatalog)
  const catalogRef = useRef(catalog)
  const cloudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useLayoutEffect(() => {
    catalogRef.current = catalog
  }, [catalog])

  const scheduleCloudSave = useCallback((next: FullMenuCatalog) => {
    if (!isFirebaseMenuConfigured()) return
    if (cloudTimerRef.current) clearTimeout(cloudTimerRef.current)
    cloudTimerRef.current = setTimeout(() => {
      cloudTimerRef.current = null
      void saveMenuCatalogToCloud(next).catch((err) => {
        console.warn('[Lily] Firebase sync failed', err)
      })
    }, CLOUD_SAVE_DEBOUNCE_MS)
  }, [])

  useEffect(() => {
    if (!isFirebaseMenuConfigured()) return
    return subscribeMenuCatalog(
      (remote) => {
        setCatalogState(remote)
        saveFullMenuToStorage(remote)
      },
      (err) => console.warn('[Lily] Firebase listener', err)
    )
  }, [])

  const persist = useCallback(
    (next: FullMenuCatalog) => {
      saveFullMenuToStorage(next)
      scheduleCloudSave(next)
    },
    [scheduleCloudSave]
  )

  const saveChangesNow = useCallback(async () => {
    const snap = catalogRef.current
    saveFullMenuToStorage(snap)
    if (cloudTimerRef.current) {
      clearTimeout(cloudTimerRef.current)
      cloudTimerRef.current = null
    }
    await saveMenuCatalogToCloud(snap, { strict: true })
  }, [])

  const updateCatalog = useCallback(
    (updater: (prev: FullMenuCatalog) => FullMenuCatalog) => {
      setCatalogState((prev) => {
        const next = updater(prev)
        persist(next)
        return next
      })
    },
    [persist]
  )

  const setGreenMenu = useCallback(
    (updater: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])) => {
      updateCatalog((c) => {
        const prevGreen = c.greenMenu
        const nextGreen =
          typeof updater === 'function' ? updater(prevGreen) : updater
        const prevIds = new Set(prevGreen.map((i) => i.id))
        const nextIds = new Set(nextGreen.map((i) => i.id))
        const removed = new Set(c.removedGreenItemIds ?? [])
        for (const id of prevIds) {
          if (!nextIds.has(id)) removed.add(id)
        }
        return {
          ...c,
          greenMenu: nextGreen,
          removedGreenItemIds: [...removed],
        }
      })
    },
    [updateCatalog]
  )

  const setPage2 = useCallback(
    (updater: Page2Catalog | ((prev: Page2Catalog) => Page2Catalog)) => {
      updateCatalog((c) => ({
        ...c,
        page2: typeof updater === 'function' ? updater(c.page2) : updater,
      }))
    },
    [updateCatalog]
  )

  const setBeverages = useCallback(
    (
      updater:
        | BeveragesCatalog
        | ((prev: BeveragesCatalog) => BeveragesCatalog)
    ) => {
      updateCatalog((c) => ({
        ...c,
        beverages: typeof updater === 'function' ? updater(c.beverages) : updater,
      }))
    },
    [updateCatalog]
  )

  const setFullCatalog = useCallback(
    (next: FullMenuCatalog) => {
      setCatalogState(next)
      persist(next)
    },
    [persist]
  )

  const resetAllToDefaults = useCallback(() => {
    clearFullMenuStorage()
    const next = defaultFullMenuCatalog()
    setCatalogState(next)
    saveFullMenuToStorage(next)
    scheduleCloudSave(next)
  }, [scheduleCloudSave])

  const greenByCategory = useMemo(
    () => groupByCategory(catalog.greenMenu),
    [catalog.greenMenu]
  )

  const value = useMemo(
    () => ({
      catalog,
      greenByCategory,
      setGreenMenu,
      setPage2,
      setBeverages,
      setFullCatalog,
      resetAllToDefaults,
      saveChangesNow,
    }),
    [
      catalog,
      greenByCategory,
      setGreenMenu,
      setPage2,
      setBeverages,
      setFullCatalog,
      resetAllToDefaults,
      saveChangesNow,
    ]
  )

  return (
    <MenuCatalogContext.Provider value={value}>
      {children}
    </MenuCatalogContext.Provider>
  )
}

/** Green LILY card: items grouped by category. */
export function useMenuCatalog(): {
  items: MenuItem[]
  byCategory: Map<string, MenuItem[]>
  setItems: (
    updater: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])
  ) => void
} {
  const ctx = useContext(MenuCatalogContext)
  if (!ctx) {
    throw new Error('useMenuCatalog must be used within MenuCatalogProvider')
  }
  return {
    items: ctx.catalog.greenMenu,
    byCategory: ctx.greenByCategory,
    setItems: ctx.setGreenMenu,
  }
}

export function useMenuCatalogContext(): MenuCatalogContextValue {
  const ctx = useContext(MenuCatalogContext)
  if (!ctx) {
    throw new Error('useMenuCatalogContext must be used within MenuCatalogProvider')
  }
  return ctx
}
