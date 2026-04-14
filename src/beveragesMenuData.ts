export type BeverageRow = {
  id: string
  name: string
  small?: number
  medium?: number
  large?: number
}

export const BEVERAGES_BLACK_COFFEE: BeverageRow[] = [
  { id: 'americano', name: 'Americano', small: 250_000, medium: 300_000, large: 350_000 },
  { id: 'espresso', name: 'Espresso (short / lungo)', small: 150_000 },
  { id: 'doppio', name: 'Doppio', small: 200_000 },
]

export const BEVERAGES_HOT: BeverageRow[] = [
  { id: 'cappuccino', name: 'Cappuccino', small: 270_000, medium: 320_000, large: 380_000 },
  { id: 'latte', name: 'Latte', small: 270_000, medium: 320_000, large: 380_000 },
  { id: 'mocha', name: 'Mocha', small: 300_000, medium: 350_000, large: 400_000 },
  { id: 'white-mocha', name: 'White Mocha', small: 300_000, medium: 350_000, large: 400_000 },
  { id: 'spanish-latte', name: 'Spanish Latte', small: 380_000, medium: 470_000 },
  { id: 'caramel-macchiato', name: 'Caramel Macchiato', small: 300_000, medium: 350_000, large: 400_000 },
  { id: 'flat-white', name: 'Flat White', small: 270_000 },
  { id: 'salted-caramel-latte', name: 'Salted Caramel Latte', small: 300_000, medium: 350_000, large: 420_000 },
  { id: 'hot-chocolate', name: 'Hot Chocolate', small: 300_000, medium: 350_000, large: 420_000 },
  { id: 'nescafe', name: 'Nescafe', small: 150_000 },
  { id: 'black-tea', name: 'Black Tea', small: 150_000 },
]

export const BEVERAGES_BLENDED: BeverageRow[] = [
  { id: 'espresso-frappe', name: 'Espresso Frappe', medium: 350_000, large: 400_000 },
  { id: 'caramel-cream-frappe', name: 'Caramel Cream Frappe', medium: 430_000, large: 480_000 },
  { id: 'hazelnut-frappe', name: 'Hazelnut Frappe', medium: 430_000, large: 480_000 },
  { id: 'vanille-cream-frappe', name: 'Vanille Cream Frappe', medium: 430_000, large: 480_000 },
  { id: 'chocolate-cream-frappe', name: 'Chocolate Cream Frappe', medium: 430_000, large: 480_000 },
  { id: 'white-mocha-cream-frappe', name: 'White Mocha Cream Frappe', medium: 430_000, large: 480_000 },
  { id: 'salted-caramel-cream-frappe', name: 'Salted Caramel Cream Frappe', medium: 430_000, large: 480_000 },
  { id: 'milkshake', name: 'Milkshake (Choco / Strawberry)', medium: 400_000 },
]

export const BEVERAGES_ICED: BeverageRow[] = [
  { id: 'iced-americano', name: 'Iced Americano', medium: 370_000, large: 420_000 },
  { id: 'iced-latte', name: 'Iced Latte', medium: 320_000, large: 380_000 },
  { id: 'iced-mocha', name: 'Iced Mocha', medium: 350_000, large: 400_000 },
  { id: 'iced-chocolate', name: 'Iced Chocolate', medium: 350_000, large: 420_000 },
  { id: 'iced-caramel-macchiato', name: 'Iced Caramel Macchiato', medium: 350_000, large: 400_000 },
  { id: 'iced-salted-caramel-latte', name: 'Iced Salted Caramel Latte', medium: 350_000, large: 400_000 },
  { id: 'iced-spanish-latte', name: 'Iced Spanish Latte', medium: 470_000 },
  { id: 'iced-white-mocha', name: 'Iced White Mocha', medium: 350_000, large: 400_000 },
  {
    id: 'homemade-iced-tea-peach',
    name: 'Homemade Iced Tea Peach',
    medium: 320_000,
    large: 360_000,
  },
  { id: 'lemonade', name: 'Lemonade', medium: 280_000, large: 320_000 },
]

export type BevSimpleLine = { id: string; name: string; price: number }

export const BEVERAGES_DRINKS: BevSimpleLine[] = [
  { id: 'water-bottle', name: 'Water Bottle (500 ml)', price: 70_000 },
  { id: 'orange-juice', name: 'Orange Juice (250 ml)', price: 250_000 },
  { id: 'pomegranate-juice', name: 'Pomegranate Juice (250 ml)', price: 250_000 },
  { id: 'rim-sparkling', name: 'Rim Sparkling Water (250 ml)', price: 100_000 },
  { id: 'red-bull', name: 'Red Bull', price: 300_000 },
  { id: 'soft-drink', name: 'Soft Drink', price: 100_000 },
]

export const BEVERAGES_NARGILEH: BevSimpleLine[] = [
  { id: 'nargileh-maasal', name: 'Maasal', price: 650_000 },
  { id: 'nargileh-asfahani', name: 'Asfahani', price: 800_000 },
  { id: 'nargileh-terki', name: 'Terki', price: 800_000 },
  { id: 'nargileh-service', name: 'Service', price: 400_000 },
]
