import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import './MenuPage2.css'
import './style.css'
import { App } from './App.tsx'
import { MenuCatalogProvider } from './MenuCatalogContext'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

createRoot(root).render(
  <StrictMode>
    <MenuCatalogProvider>
      <App />
    </MenuCatalogProvider>
  </StrictMode>
)
