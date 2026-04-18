import type { ReactNode } from 'react'
import type { MenuItem } from './types'
import { formatPrice } from './formatPrice'
import { useMenuCatalog, useMenuCatalogContext } from './MenuCatalogContext'

/** Categories shown side-by-side at the top (match `category` on items, case-insensitive). */
const TOP_ROW_CATEGORY_LABELS = ['AL FORNO', 'KAEKE'] as const

const BAGUETTE_CATEGORY = 'MULTI-CEREAL BAGUETTE'
/** Rendered with beverages (before blended); kept out of the first green card. */
const TEA_CATEGORY = 'TEA'

function isBaguetteCategory(categoryKey: string) {
  return categoryKey.trim().toUpperCase() === BAGUETTE_CATEGORY
}

function categoryKeyForLabel(
  byCategory: Map<string, MenuItem[]>,
  label: string
): string | undefined {
  const u = label.toUpperCase()
  for (const k of byCategory.keys()) {
    if (k.trim().toUpperCase() === u) return k
  }
  return undefined
}

function categoryFooterFor(items: MenuItem[]): string | undefined {
  for (const item of items) {
    if (item.categoryFooter) return item.categoryFooter
  }
  return undefined
}

function minSortOrder(items: MenuItem[]): number {
  return Math.min(...items.map((i) => i.sortOrder))
}

const restaurantName = import.meta.env.VITE_RESTAURANT_NAME?.trim() || 'LILY'

/** Green card: LILY + first part of the menu (stacked with burgundy card below). */
export function MainMenuPanel({ headerAddon }: { headerAddon?: ReactNode }) {
  const menu = useMenuCatalog()

  const topRowKeys = TOP_ROW_CATEGORY_LABELS.map((label) =>
    categoryKeyForLabel(menu.byCategory, label)
  ).filter((k): k is string => k !== undefined)

  const topKeySet = new Set(topRowKeys)
  const otherKeys = [...menu.byCategory.keys()]
    .filter(
      (k) =>
        !topKeySet.has(k) && k.trim().toUpperCase() !== TEA_CATEGORY
    )
    .sort((a, b) => {
      const da = menu.byCategory.get(a) ?? []
      const db = menu.byCategory.get(b) ?? []
      const orderA = minSortOrder(da)
      const orderB = minSortOrder(db)
      if (orderA !== orderB) return orderA - orderB
      return a.localeCompare(b, undefined, { sensitivity: 'base' })
    })

  return (
    <div className="menu-panel menu-panel--main">
      <header className="menu-header">
        <h1 id="menu-brand-title" className="brand">
          {restaurantName}
        </h1>
        {headerAddon}
      </header>

      <main className="menu-body">
        {topRowKeys.length > 0 ? (
          <div className="menu-top-columns">
            {topRowKeys.map((categoryKey) => (
              <CategoryBlock
                key={categoryKey}
                categoryKey={categoryKey}
                items={menu.byCategory.get(categoryKey) ?? []}
                variant="compact"
              />
            ))}
          </div>
        ) : null}

        {otherKeys.map((categoryKey) => (
          <CategoryBlock
            key={categoryKey}
            categoryKey={categoryKey}
            items={menu.byCategory.get(categoryKey) ?? []}
            variant={isBaguetteCategory(categoryKey) ? 'baguette' : 'full'}
          />
        ))}
      </main>
    </div>
  )
}

type CategoryBlockProps = {
  categoryKey: string
  items: MenuItem[]
  variant: 'compact' | 'full' | 'baguette'
}

/** TEA block: same styling as other full categories; placed before blended drinks on the page. */
export function TeaCategorySection() {
  const menu = useMenuCatalog()
  const key = [...menu.byCategory.keys()].find(
    (k) => k.trim().toUpperCase() === TEA_CATEGORY
  )
  if (!key) return null
  const items = menu.byCategory.get(key) ?? []
  if (items.length === 0) return null
  return <CategoryBlock categoryKey={key} items={items} variant="full" />
}

function CategoryBlock({ categoryKey, items, variant }: CategoryBlockProps) {
  const footer = categoryFooterFor(items)
  const titleId = `cat-${categoryKey.replace(/\s+/g, '-')}`
  const isBaguette = variant === 'baguette'

  return (
    <section
      className={`menu-category menu-category--${variant}`}
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className="menu-category-title">
        {categoryKey.toUpperCase()}
      </h2>
      <ul className="menu-lines">
        {items.map((item) =>
          isBaguette ? (
            <li key={item.id} className="menu-line menu-line--baguette">
              <div className="menu-line-baguette">
                <div className="menu-line-baguette-body">
                  <span className="menu-line-name">{item.name}</span>
                  {item.description ? (
                    <p className="menu-line-desc">{item.description}</p>
                  ) : null}
                </div>
                <span className="menu-line-price">{formatPrice(item.price)}</span>
              </div>
            </li>
          ) : (
            <li key={item.id} className="menu-line">
              <div className="menu-line-main">
                <span className="menu-line-name">{item.name}</span>
                <span className="menu-line-price">{formatPrice(item.price)}</span>
              </div>
              {item.description ? (
                <p className="menu-line-desc">{item.description}</p>
              ) : null}
            </li>
          )
        )}
      </ul>
      {footer ? <p className="menu-category-footnote">{footer}</p> : null}
      {isBaguette ? (
        <>
          <p className="menu-vat-notice">All prices inc. VAT</p>
          <div className="menu-stripe-bar" aria-hidden="true" />
        </>
      ) : null}
    </section>
  )
}

/** Burgundy card: starters, sharing, salads (stacked under the green menu). */
export function SecondaryMenuPanel() {
  const { catalog } = useMenuCatalogContext()
  const {
    startersLeft,
    startersRight,
    startersNote,
    sharing,
    salads,
  } = catalog.page2
  const saladSharedAddOns = salads.find((s) => s.addOns && s.addOns.length > 0)?.addOns

  return (
    <div className="menu-panel menu-panel--page2">
      <main className="menu-body p2-body">
        <section className="p2-section" aria-labelledby="p2-starters">
          <h2 id="p2-starters" className="menu-category-title p2-section-title">
            STARTERS
          </h2>
          <div className="p2-starters-cols">
            <ul className="menu-lines">
              {startersLeft.map((row) => (
                <li key={row.id} className="menu-line">
                  <div className="menu-line-main">
                    <span className="menu-line-name">{row.name}</span>
                    <span className="menu-line-price">{formatPrice(row.price)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p2-starters-right">
              <ul className="menu-lines">
                {startersRight.map((row) => (
                  <li key={row.id} className="menu-line">
                    <div className="menu-line-main">
                      <span className="menu-line-name">{row.name}</span>
                      <span className="menu-line-price">{formatPrice(row.price)}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="p2-starters-note">{startersNote}</p>
            </div>
          </div>
        </section>

        <section className="p2-section" aria-labelledby="p2-sharing">
          <h2 id="p2-sharing" className="menu-category-title p2-section-title">
            SHARING
          </h2>
          <ul className="menu-lines">
            {sharing.map((item) => (
              <li key={item.id} className="menu-line menu-line--baguette">
                <div className="menu-line-baguette">
                  <div className="menu-line-baguette-body">
                    <span className="menu-line-name">{item.name}</span>
                    <p className="menu-line-desc">{item.description}</p>
                  </div>
                  <span className="menu-line-price">{formatPrice(item.price)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="p2-section p2-section--salads" aria-labelledby="p2-salads">
          <h2 id="p2-salads" className="menu-category-title p2-section-title">
            SALADS
          </h2>
          <ul className="menu-lines">
            {salads.map((item) => (
              <li key={item.id} className="p2-salad-entry menu-line menu-line--baguette">
                <div className="menu-line-baguette">
                  <div className="menu-line-baguette-body">
                    <span className="menu-line-name">{item.name}</span>
                    <p className="menu-line-desc">{item.description}</p>
                  </div>
                  <span className="menu-line-price">{formatPrice(item.price)}</span>
                </div>
              </li>
            ))}
          </ul>
          {saladSharedAddOns && saladSharedAddOns.length > 0 ? (
            <div className="p2-salad-addons">
              <p className="p2-salad-addons-label">Add:</p>
              <ul className="p2-salad-addons-list">
                {saladSharedAddOns.map((add) => (
                  <li key={add.name} className="p2-salad-addon-item">
                    {add.name}: {formatPrice(add.price)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <footer className="p2-panel-footer">
          <p className="menu-vat-notice">All prices inc. VAT</p>
          <div className="menu-stripe-bar" aria-hidden="true" />
        </footer>
      </main>
    </div>
  )
}

/** Third burgundy card: WOK NOODLES + BOWL (one panel, one footer). */
export function WokNoodlesMenuPanel() {
  const { catalog } = useMenuCatalogContext()
  const { wok, bowl } = catalog.page2

  return (
    <div className="menu-panel menu-panel--page2">
      <main className="menu-body p2-body">
        <section className="p2-section p2-section--wok" aria-labelledby="p2-wok-noodles">
          <h2 id="p2-wok-noodles" className="menu-category-title p2-section-title">
            WOK NOODLES
          </h2>
          <ul className="menu-lines">
            {wok.map((item) => (
              <li key={item.id} className="menu-line menu-line--baguette">
                <div className="menu-line-baguette">
                  <div className="menu-line-baguette-body">
                    <span className="menu-line-name">{item.name}</span>
                    <p className="menu-line-desc">{item.description}</p>
                  </div>
                  <span className="menu-line-price">{formatPrice(item.price)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="p2-section p2-section--bowl" aria-labelledby="p2-bowl">
          <h2 id="p2-bowl" className="menu-category-title p2-section-title">
            BOWL
          </h2>
          <ul className="menu-lines">
            {bowl.map((item) => (
              <li key={item.id} className="menu-line menu-line--baguette">
                <div className="menu-line-baguette">
                  <div className="menu-line-baguette-body">
                    <span className="menu-line-name">{item.name}</span>
                    <p className="menu-line-desc">{item.description}</p>
                  </div>
                  <span className="menu-line-price">{formatPrice(item.price)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="p2-panel-footer">
          <p className="menu-vat-notice">All prices inc. VAT</p>
          <div className="menu-stripe-bar" aria-hidden="true" />
        </footer>
      </main>
    </div>
  )
}

/** Fourth burgundy card: signature rolls (+ meal upgrade) and pizza. */
export function SignatureRollsPizzaMenuPanel() {
  const { catalog } = useMenuCatalogContext()
  const {
    signatureRolls,
    pizza,
    rollsMealUpgradePrice,
    rollsMealUpgradeSubtext,
  } = catalog.page2

  return (
    <div className="menu-panel menu-panel--page2">
      <main className="menu-body p2-body">
        <section className="p2-section p2-section--rolls" aria-labelledby="p2-signature-rolls">
          <h2 id="p2-signature-rolls" className="menu-category-title p2-section-title">
            SIGNATURE ROLLS
          </h2>
          <ul className="menu-lines">
            {signatureRolls.map((item) => (
              <li key={item.id} className="menu-line menu-line--baguette">
                <div className="menu-line-baguette">
                  <div className="menu-line-baguette-body">
                    <span className="menu-line-name">{item.name}</span>
                    <p className="menu-line-desc">{item.description}</p>
                  </div>
                  <span className="menu-line-price">{formatPrice(item.price)}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="p2-meal-upgrade">
            <p className="p2-meal-upgrade-label">Meal upgrade</p>
            <p className="p2-meal-upgrade-headline">
              Upgrade to meal + {formatPrice(rollsMealUpgradePrice)}
            </p>
            <p className="p2-meal-upgrade-sub">{rollsMealUpgradeSubtext}</p>
          </div>
        </section>

        <section className="p2-section p2-section--pizza" aria-labelledby="p2-pizza">
          <h2 id="p2-pizza" className="menu-category-title p2-section-title">
            PIZZA
          </h2>
          <ul className="menu-lines">
            {pizza.map((item) => (
              <li key={item.id} className="menu-line menu-line--baguette">
                <div className="menu-line-baguette">
                  <div className="menu-line-baguette-body">
                    <span className="menu-line-name">{item.name}</span>
                    <p className="menu-line-desc">{item.description}</p>
                  </div>
                  <span className="menu-line-price">{formatPrice(item.price)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="p2-panel-footer">
          <p className="menu-vat-notice">All prices inc. VAT</p>
          <div className="menu-stripe-bar" aria-hidden="true" />
        </footer>
      </main>
    </div>
  )
}

/** Fifth burgundy card: burgers (+ meal upgrade) and French tacos. */
export function BurgersFrenchTacosMenuPanel() {
  const { catalog } = useMenuCatalogContext()
  const {
    burgers,
    frenchTacos,
    rollsMealUpgradePrice,
    rollsMealUpgradeSubtext,
  } = catalog.page2

  return (
    <div className="menu-panel menu-panel--page2">
      <main className="menu-body p2-body">
        <section className="p2-section p2-section--burgers" aria-labelledby="p2-burgers">
          <h2 id="p2-burgers" className="menu-category-title p2-section-title">
            BURGERS
          </h2>
          <ul className="menu-lines">
            {burgers.map((item) => (
              <li key={item.id} className="menu-line menu-line--baguette">
                <div className="menu-line-baguette">
                  <div className="menu-line-baguette-body">
                    <span className="menu-line-name">{item.name}</span>
                    <p className="menu-line-desc">{item.description}</p>
                  </div>
                  <span className="menu-line-price">{formatPrice(item.price)}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="p2-meal-upgrade">
            <p className="p2-meal-upgrade-label">Meal upgrade</p>
            <p className="p2-meal-upgrade-headline">
              Upgrade to meal + {formatPrice(rollsMealUpgradePrice)}
            </p>
            <p className="p2-meal-upgrade-sub">{rollsMealUpgradeSubtext}</p>
          </div>
        </section>

        <section className="p2-section p2-section--tacos" aria-labelledby="p2-french-tacos">
          <h2 id="p2-french-tacos" className="menu-category-title p2-section-title">
            FRENCH TACOS
          </h2>
          <ul className="menu-lines">
            {frenchTacos.map((item) => (
              <li key={item.id} className="menu-line menu-line--baguette">
                <div className="menu-line-baguette">
                  <div className="menu-line-baguette-body">
                    <span className="menu-line-name">{item.name}</span>
                    <p className="menu-line-desc">{item.description}</p>
                  </div>
                  <span className="menu-line-price">{formatPrice(item.price)}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="p2-meal-upgrade">
            <p className="p2-meal-upgrade-label">Meal upgrade</p>
            <p className="p2-meal-upgrade-headline">
              Upgrade to meal + {formatPrice(rollsMealUpgradePrice)}
            </p>
            <p className="p2-meal-upgrade-sub">{rollsMealUpgradeSubtext}</p>
          </div>
        </section>

        <footer className="p2-panel-footer">
          <p className="menu-vat-notice">All prices inc. VAT</p>
          <div className="menu-stripe-bar" aria-hidden="true" />
        </footer>
      </main>
    </div>
  )
}
