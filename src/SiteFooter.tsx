import './SiteFooter.css'

const INSTAGRAM_URL = 'https://www.instagram.com/lily.lebanon'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__logo">LILY</p>
          <p className="site-footer__tagline">
            Café &amp; Kitchen. Fresh bites, bold flavors, specialty coffee, and cozy
            moments — every day.
          </p>
        </div>
        <div className="site-footer__visit">
          <p className="site-footer__heading">VISIT</p>
          <p className="site-footer__line">Koura — facing LIU</p>
          <a
            className="site-footer__link"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            @lily.lebanon
          </a>
          <p className="site-footer__line">Open daily • 8:00 am till 11:45 pm</p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <p className="site-footer__copyright">© 2025 LILY — CAFÉ &amp; KITCHEN</p>
      </div>
    </footer>
  )
}
