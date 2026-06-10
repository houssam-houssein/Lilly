import type { ReactNode } from 'react'
import './MenuIntroHeader.css'

export function MenuIntroHeader({ children }: { children?: ReactNode }) {
  return (
    <section id="menu-intro-header" className="menu-intro-header">
      <p className="menu-intro-eyebrow">
        <span className="menu-intro-eyebrow-line" aria-hidden="true" />
        <span>THE FULL MENU</span>
        <span className="menu-intro-eyebrow-line" aria-hidden="true" />
      </p>
      <h2 id="menu-section-title" className="menu-intro-title">
        <span className="menu-intro-title-line">
          CRAFTED WITH <em className="menu-intro-care">care</em>,
        </span>
        <span className="menu-intro-title-line">SERVED WITH SOUL.</span>
      </h2>
      {children}
    </section>
  )
}
