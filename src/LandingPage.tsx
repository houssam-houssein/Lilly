import './LandingPage.css'

const HERO_IMAGE = `${import.meta.env.BASE_URL}hero.webp`

export function LandingPage() {
  return (
    <section className="landing-page" aria-label="Welcome to Lily Cafe and Kitchen">
      <img
        className="landing-page__bg"
        src={HERO_IMAGE}
        alt=""
        fetchPriority="high"
        decoding="async"
        aria-hidden="true"
      />
      <div className="landing-page__overlay" aria-hidden="true" />
      <div className="landing-page__content">
        <p className="landing-page__est">
          <span className="landing-page__est-line" aria-hidden="true" />
          <span>EST. LILY — CAFE &amp; KITCHEN</span>
          <span className="landing-page__est-line" aria-hidden="true" />
        </p>
        <h1 className="landing-page__headline">
          <span className="landing-page__headline-line">TASTE THE</span>
          <span className="landing-page__headline-script">Lily</span>
          <span className="landing-page__headline-line">WAY</span>
        </h1>
        <p className="landing-page__tagline">
          Fresh bites, bold flavors, specialty coffee, and cozy café moments — crafted
          with intention from morning to midnight.
        </p>
      </div>
    </section>
  )
}
