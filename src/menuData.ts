import type { MenuItem } from './types'

/** Local menu content — replace or load from an API later. */
export const MENU_ITEMS: MenuItem[] = [
  // AL FORNO
  { id: 'alforno-zaatar', name: 'Zaatar', price: 110_000, category: 'AL FORNO', description: '', sortOrder: 10 },
  { id: 'alforno-cheese', name: 'Cheese', price: 220_000, category: 'AL FORNO', description: '', sortOrder: 20 },
  { id: 'alforno-cocktail', name: 'Cocktail', price: 240_000, category: 'AL FORNO', description: '', sortOrder: 30 },
  { id: 'alforno-turkey-cheese', name: 'Turkey & Cheese', price: 300_000, category: 'AL FORNO', description: '', sortOrder: 40 },
  { id: 'alforno-labneh', name: 'Labneh', price: 220_000, category: 'AL FORNO', description: '', sortOrder: 50 },
  { id: 'alforno-labneh-zaatar', name: 'Labneh & Zaatar', price: 240_000, category: 'AL FORNO', description: '', sortOrder: 60 },
  { id: 'alforno-duplex', name: 'Duplex', price: 430_000, category: 'AL FORNO', description: '', sortOrder: 70 },
  { id: 'alforno-lahmeh', name: 'Lahmeh', price: 480_000, category: 'AL FORNO', description: '', sortOrder: 80 },
  {
    id: 'alforno-nutella',
    name: 'Nutella',
    price: 350_000,
    category: 'AL FORNO',
    description: '',
    sortOrder: 90,
    categoryFooter: 'served as manakish or saj',
  },
  // KAEKE
  { id: 'kaeke-cheese', name: 'Cheese', price: 220_000, category: 'KAEKE', description: '', sortOrder: 10 },
  { id: 'kaeke-turkey-cheese', name: 'Turkey & Cheese', price: 300_000, category: 'KAEKE', description: '', sortOrder: 20 },
  { id: 'kaeke-three-cheese', name: 'Three Cheese', price: 300_000, category: 'KAEKE', description: '', sortOrder: 30 },
  { id: 'kaeke-pepperoni', name: 'Pepperoni Cheese', price: 350_000, category: 'KAEKE', description: '', sortOrder: 40 },
  { id: 'kaeke-cheddar-chitos', name: 'Cheddar Chitos', price: 350_000, category: 'KAEKE', description: '', sortOrder: 50 },
  // PATTY MELT
  {
    id: 'patty-lily-cheese',
    name: 'Lily Cheese',
    price: 450_000,
    category: 'PATTY MELT',
    description: 'Mozzarella cheese, cheddar cheese, mayo in a soft toasted bun.',
    sortOrder: 10,
  },
  // MULTI-CEREAL BAGUETTE (full-width block at end of menu)
  {
    id: 'baguette-turkey-cheese',
    name: 'Turkey & Cheese',
    price: 650_000,
    category: 'MULTI-CEREAL BAGUETTE',
    description:
      'Smoked turkey, mozzarella cheese, iceberg, tomato, pickles, mayo mustard sauce in multi-cereal baguette',
    sortOrder: 100,
  },
  {
    id: 'baguette-veggie-labneh',
    name: 'Veggie Labneh',
    price: 400_000,
    category: 'MULTI-CEREAL BAGUETTE',
    description: 'Labneh, cucumber, tomato, olives in multi-cereal baguette',
    sortOrder: 110,
  },
  {
    id: 'baguette-halloumi-pesto',
    name: 'Halloumi Pesto',
    price: 700_000,
    category: 'MULTI-CEREAL BAGUETTE',
    description: 'Halloumi, cucumber, tomato, pesto sauce in multi-cereal baguette',
    sortOrder: 120,
  },
  // TEA
  { id: 'tea-black', name: 'Black Tea', price: 50_000, category: 'TEA', description: '', sortOrder: 130 },
  { id: 'tea-green', name: 'Green Tea', price: 50_000, category: 'TEA', description: '', sortOrder: 140 },
]
