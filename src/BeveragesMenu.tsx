import { formatPrice } from './formatPrice'
import type { BeverageRow, BevSimpleLine } from './beveragesMenuData'
import { TeaCategorySection } from './Menu'
import { useMenuCatalogContext } from './MenuCatalogContext'
import './BeveragesMenu.css'

function priceCell(value: number | undefined) {
  if (value == null) {
    return <p className="bev-price bev-price--empty" aria-hidden="true" />
  }
  return <p className="bev-price">{formatPrice(value)}</p>
}

type BeverageColumns = 'sml' | 'ml'

function BeverageSection({
  sectionId,
  title,
  rows,
  columns,
}: {
  sectionId: string
  title: string
  rows: BeverageRow[]
  columns: BeverageColumns
}) {
  const gridClass = columns === 'ml' ? 'bev-grid bev-grid--ml' : 'bev-grid'

  return (
    <section className="bev-section" aria-labelledby={sectionId}>
      <h2 id={sectionId} className="bev-section-title">
        {title}
      </h2>
      <div className={gridClass} role="table" aria-label={title}>
        <div className="bev-grid-head" role="row">
          <span className="bev-grid-corner" aria-hidden="true" />
          {columns === 'sml' ? (
            <>
              <p className="bev-size-label" role="columnheader">
                Small
              </p>
              <p className="bev-size-label" role="columnheader">
                Medium
              </p>
              <p className="bev-size-label" role="columnheader">
                Large
              </p>
            </>
          ) : (
            <>
              <p className="bev-size-label" role="columnheader">
                Medium
              </p>
              <p className="bev-size-label" role="columnheader">
                Large
              </p>
            </>
          )}
        </div>
        {rows.map((row) => (
          <div key={row.id} className="bev-grid-row" role="row">
            <p className="bev-name" role="rowheader">
              {row.name}
            </p>
            {columns === 'sml' ? (
              <>
                {priceCell(row.small)}
                {priceCell(row.medium)}
                {priceCell(row.large)}
              </>
            ) : (
              <>
                {priceCell(row.medium)}
                {priceCell(row.large)}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function BeverageSimpleSection({
  sectionId,
  title,
  rows,
}: {
  sectionId: string
  title: string
  rows: BevSimpleLine[]
}) {
  return (
    <section className="bev-section" aria-labelledby={sectionId}>
      <h2 id={sectionId} className="bev-section-title">
        {title}
      </h2>
      <ul className="bev-simple-list">
        {rows.map((row) => (
          <li key={row.id} className="bev-simple-line">
            <p className="bev-simple-name">{row.name}</p>
            <p className="bev-simple-price">{formatPrice(row.price)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function BevPanelFooter() {
  return (
    <footer className="bev-panel-footer">
      <p className="menu-vat-notice">All prices inc. VAT</p>
      <div className="menu-stripe-bar" aria-hidden="true" />
    </footer>
  )
}

/** Green card: black coffee + hot beverages (S/M/L). */
export function BeveragesCoffeeHotPanel() {
  const { catalog } = useMenuCatalogContext()
  const { blackCoffee, hot } = catalog.beverages

  return (
    <div className="menu-panel menu-panel--main">
      <main className="menu-body bev-body">
        <BeverageSection
          sectionId="bev-black-coffee"
          title="Black coffee"
          rows={blackCoffee}
          columns="sml"
        />
        <BeverageSection sectionId="bev-hot" title="Hot beverages" rows={hot} columns="sml" />
        <BevPanelFooter />
      </main>
    </div>
  )
}

/** Green card: blended drinks + iced beverages (M/L). */
export function BeveragesBlendedIcedPanel() {
  const { catalog } = useMenuCatalogContext()
  const { blended, iced } = catalog.beverages

  return (
    <div className="menu-panel menu-panel--main">
      <main className="menu-body bev-body">
        <div className="bev-tea-wrap">
          <TeaCategorySection />
        </div>
        <BeverageSection
          sectionId="bev-blended"
          title="Blended drinks"
          rows={blended}
          columns="ml"
        />
        <BeverageSection sectionId="bev-iced" title="Iced beverages" rows={iced} columns="ml" />
        <BevPanelFooter />
      </main>
    </div>
  )
}

/** Green card: bottled drinks + nargileh (single price per line). */
export function BeveragesDrinksNargilehPanel() {
  const { catalog } = useMenuCatalogContext()
  const { drinks, nargileh } = catalog.beverages

  return (
    <div className="menu-panel menu-panel--main menu-panel--bev-drinks-narg">
      <main className="menu-body bev-body">
        <BeverageSimpleSection sectionId="bev-drinks" title="Drinks" rows={drinks} />
        <BeverageSimpleSection sectionId="bev-nargileh" title="Nargileh" rows={nargileh} />
        <BevPanelFooter />
      </main>
    </div>
  )
}
