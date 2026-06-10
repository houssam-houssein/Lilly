import { formatPrice } from './formatPrice'

type MenuLineMainProps = {
  name: string
  price: number | string
}

export function MenuLineMain({ name, price }: MenuLineMainProps) {
  const priceText = typeof price === 'number' ? formatPrice(price) : price

  return (
    <div className="menu-line-main">
      <span className="menu-line-name">{name}</span>
      <span className="menu-line-leader" aria-hidden="true" />
      <span className="menu-line-price">{priceText}</span>
    </div>
  )
}
