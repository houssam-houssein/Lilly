import { useEffect, useMemo, useState } from 'react'
import {
  BeveragesBlendedIcedPanel,
  BeveragesCoffeeHotPanel,
  BeveragesDrinksNargilehPanel,
} from './BeveragesMenu'
import { AdminDashboard } from './AdminDashboard'
import {
  BurgersFrenchTacosMenuPanel,
  MainMenuPanel,
  SecondaryMenuPanel,
  SignatureRollsPizzaMenuPanel,
  WokNoodlesMenuPanel,
} from './Menu'

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return hash
}

type PublicCategory = {
  id: string
  label: string
  targetId: string
}

export function App() {
  const hash = useHashRoute()
  const showAdminEntry =
    import.meta.env.DEV || import.meta.env.VITE_SHOW_ADMIN_LINK === 'true'
  const categories = useMemo<PublicCategory[]>(
    () => [
      { id: 'al-forno', label: 'AL FORNO', targetId: 'cat-AL-FORNO' },
      { id: 'kaeke', label: 'KAEKE', targetId: 'cat-KAEKE' },
      { id: 'patty-melt', label: 'PATTY MELT', targetId: 'cat-PATTY-MELT' },
      {
        id: 'baguette',
        label: 'MULTI-CEREAL BAGUETTE',
        targetId: 'cat-MULTI-CEREAL-BAGUETTE',
      },
      { id: 'starters', label: 'STARTERS', targetId: 'p2-starters' },
      { id: 'sharing', label: 'SHARING', targetId: 'p2-sharing' },
      { id: 'salads', label: 'SALADS', targetId: 'p2-salads' },
      { id: 'wok', label: 'WOK NOODLES', targetId: 'p2-wok-noodles' },
      { id: 'bowl', label: 'BOWL', targetId: 'p2-bowl' },
      { id: 'rolls', label: 'SIGNATURE ROLLS', targetId: 'p2-signature-rolls' },
      { id: 'pizza', label: 'PIZZA', targetId: 'p2-pizza' },
      { id: 'burgers', label: 'BURGERS', targetId: 'p2-burgers' },
      { id: 'tacos', label: 'FRENCH TACOS', targetId: 'p2-french-tacos' },
      { id: 'black-coffee', label: 'BLACK COFFEE', targetId: 'bev-black-coffee' },
      { id: 'hot', label: 'HOT BEVERAGES', targetId: 'bev-hot' },
      { id: 'tea', label: 'TEA', targetId: 'cat-TEA' },
      { id: 'blended', label: 'BLENDED DRINKS', targetId: 'bev-blended' },
      { id: 'iced', label: 'ICED BEVERAGES', targetId: 'bev-iced' },
      { id: 'drinks', label: 'DRINKS', targetId: 'bev-drinks' },
      { id: 'nargileh', label: 'NARGILEH', targetId: 'bev-nargileh' },
    ],
    []
  )
  const [activeTarget, setActiveTarget] = useState('panel-main')
  const [navPinned, setNavPinned] = useState(false)

  const grouped = new Map<string, PublicCategory[]>()
  for (const item of categories) {
    const list = grouped.get(item.targetId)
    if (list) list.push(item)
    else grouped.set(item.targetId, [item])
  }

  const firstCategoryForTarget = (targetId: string) =>
    grouped.get(targetId)?.[0]?.id ?? ''

  useEffect(() => {
    const targets = [...grouped.keys()]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (targets.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          setActiveTarget(visible[0].target.id)
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.2, 0.45, 0.7],
      }
    )
    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [categories])

  useEffect(() => {
    const onScroll = () => {
      const title = document.getElementById('menu-brand-title')
      if (!title) return
      const rect = title.getBoundingClientRect()
      setNavPinned(rect.bottom <= 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (hash === '#/admin') {
    return <AdminDashboard />
  }

  return (
    <div className="menu-page menu-page--stacked">
      <div id="panel-main" className="menu-page-inner">
        <MainMenuPanel
          headerAddon={
            <nav
              className={`menu-jump-nav${navPinned ? ' menu-jump-nav--pinned' : ''}`}
              aria-label="Menu categories"
            >
              {categories.map((cat) => {
                const activeId = firstCategoryForTarget(activeTarget)
                const isActive = cat.id === activeId
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`menu-jump-chip${isActive ? ' menu-jump-chip--active' : ''}`}
                    onClick={() => {
                      const target = document.getElementById(cat.targetId)
                      if (!target) return
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </nav>
          }
        />
      </div>
      <div id="panel-secondary" className="menu-page-inner menu-page-inner--spaced">
        <SecondaryMenuPanel />
      </div>
      <div id="panel-wok-bowl" className="menu-page-inner menu-page-inner--spaced">
        <WokNoodlesMenuPanel />
      </div>
      <div id="panel-rolls-pizza" className="menu-page-inner menu-page-inner--spaced">
        <SignatureRollsPizzaMenuPanel />
      </div>
      <div id="panel-burgers-tacos" className="menu-page-inner menu-page-inner--spaced">
        <BurgersFrenchTacosMenuPanel />
      </div>
      <div id="panel-coffee-hot" className="menu-page-inner menu-page-inner--spaced">
        <BeveragesCoffeeHotPanel />
      </div>
      <div id="panel-blended-iced" className="menu-page-inner menu-page-inner--spaced">
        <BeveragesBlendedIcedPanel />
      </div>
      <div id="panel-drinks-nargileh" className="menu-page-inner menu-page-inner--spaced">
        <BeveragesDrinksNargilehPanel />
      </div>
      {showAdminEntry ? (
        <div className="menu-admin-entry">
          <a href="#/admin">Admin</a>
        </div>
      ) : null}
    </div>
  )
}
