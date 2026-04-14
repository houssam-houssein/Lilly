import { useEffect, useState } from 'react'
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

export function App() {
  const hash = useHashRoute()
  const showAdminEntry =
    import.meta.env.DEV || import.meta.env.VITE_SHOW_ADMIN_LINK === 'true'

  if (hash === '#/admin') {
    return <AdminDashboard />
  }

  return (
    <div className="menu-page menu-page--stacked">
      <div className="menu-page-inner">
        <MainMenuPanel />
      </div>
      <div className="menu-page-inner menu-page-inner--spaced">
        <SecondaryMenuPanel />
      </div>
      <div className="menu-page-inner menu-page-inner--spaced">
        <WokNoodlesMenuPanel />
      </div>
      <div className="menu-page-inner menu-page-inner--spaced">
        <SignatureRollsPizzaMenuPanel />
      </div>
      <div className="menu-page-inner menu-page-inner--spaced">
        <BurgersFrenchTacosMenuPanel />
      </div>
      <div className="menu-page-inner menu-page-inner--spaced">
        <BeveragesCoffeeHotPanel />
      </div>
      <div className="menu-page-inner menu-page-inner--spaced">
        <BeveragesBlendedIcedPanel />
      </div>
      <div className="menu-page-inner menu-page-inner--spaced">
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
