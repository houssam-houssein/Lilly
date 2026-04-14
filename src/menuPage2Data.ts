export type SimpleLine = { id: string; name: string; price: number }

export const PAGE2_STARTERS_LEFT: SimpleLine[] = [
  { id: 'ff', name: 'French Fries', price: 250_000 },
  { id: 'cf', name: 'Curly Fries', price: 400_000 },
  { id: 'ms', name: 'Mozzarella Sticks', price: 380_000 },
  { id: 'sl', name: 'Coleslaw', price: 340_000 },
]

export const PAGE2_STARTERS_RIGHT: SimpleLine[] = [
  { id: 'w6', name: 'Chicken Wings (6 pcs)', price: 400_000 },
  { id: 'w10', name: 'Chicken Wings (10 pcs)', price: 520_000 },
  { id: 't3', name: 'Chicken Tenders (3 pcs)', price: 230_000 },
]

export const PAGE2_STARTERS_NOTE =
  'Your choice of BBQ, Buffalo or Honey Mustard Sauce'

export type DescLine = { id: string; name: string; price: number; description: string }

export const PAGE2_SHARING: DescLine[] = [
  {
    id: 'nachos',
    name: 'Nachos',
    price: 450_000,
    description: 'Crispy tortilla chips served with melted cheddar cheese.',
  },
  {
    id: 'mac',
    name: 'Mac & Cheese',
    price: 550_000,
    description:
      'Creamy macaroni pasta in rich cheddar cheese sauce topped with melted mozzarella.',
  },
  {
    id: 'loaded',
    name: 'Lily Loaded Fries',
    price: 550_000,
    description:
      'Crispy seasoned fries loaded with crunchy chicken bites, melted cheddar cheese, honey mustard, BBQ drizzle.',
  },
]

export type SaladLine = DescLine & {
  addOns?: { name: string; price: number }[]
}

export const PAGE2_SALADS: SaladLine[] = [
  {
    id: 'louisiana',
    name: 'Louisiana Chicken',
    price: 800_000,
    description:
      'Crispy fried chicken over mixed lettuce, avocado, cherry tomatoes, cucumber, red onion, sweet corn, tortilla strips, and shredded cheddar, served with Louisiana dressing.',
  },
  {
    id: 'tuna-pasta',
    name: 'Crunchy Tuna Pasta',
    price: 650_000,
    description:
      'Flaked tuna tossed with fusilli pasta, crisp chips, sweet corn, and bound in a mayo lemon dressing.',
  },
  {
    id: 'caesar',
    name: 'Caesar Salad',
    price: 450_000,
    description:
      'Crisp iceberg lettuce, parmesan cheese, cherry tomatoes, crunchy croutons, and creamy Caesar dressing.',
    addOns: [
      { name: 'Grilled Chicken', price: 250_000 },
      { name: 'Breaded Chicken', price: 250_000 },
    ],
  },
]

export const PAGE2_WOK: DescLine[] = [
  {
    id: 'wok-teriyaki-chicken',
    name: 'Teriyaki Chicken',
    price: 800_000,
    description:
      'Wok-tossed noodles with tender chicken strips, mixed vegetables, glazed in a teriyaki sauce.',
  },
  {
    id: 'wok-soy-garlic-shrimp',
    name: 'Soy Garlic Shrimp',
    price: 1_080_000,
    description:
      'Wok-tossed noodles with tender shrimp, fresh vegetables, and spring onions finished in a rich soy garlic glaze.',
  },
  {
    id: 'wok-beef-mushroom',
    name: 'Beef & Mushroom',
    price: 950_000,
    description:
      'Stir-fried noodles with sliced beef, sautéed mushrooms, and crunchy vegetables, finished in a rich soy-garlic wok sauce.',
  },
  {
    id: 'wok-garden-veggie',
    name: 'Garden Veggie',
    price: 550_000,
    description:
      'Wok-fried noodles with a colorful mix of fresh vegetables tossed in a light soy-sesame sauce.',
  },
]

export const PAGE2_BOWL: DescLine[] = [
  {
    id: 'bowl-entrecote',
    name: 'Entrecote Steak',
    price: 1_350_000,
    description:
      'Argentinean steak, served with fries, baguette and maison de Paris sauce.',
  },
  {
    id: 'bowl-signature-chicken',
    name: 'Signature Chicken',
    price: 1_050_000,
    description:
      'Grilled chicken breast, served with baby potatoes and mayo-bomba sauce.',
  },
  {
    id: 'bowl-lily-chicken-rice',
    name: 'Lily Chicken Rice',
    price: 750_000,
    description:
      'Lily special rice served with fried chicken strips and tomato salsa.',
  },
  {
    id: 'bowl-escalope',
    name: 'Escalope Chicken',
    price: 1_050_000,
    description:
      'Chicken escalope served with fries, coleslaw and honey mustard sauce.',
  },
]

export const PAGE2_SIGNATURE_ROLLS: DescLine[] = [
  {
    id: 'roll-hot-dog',
    name: 'Hot Dog',
    price: 550_000,
    description:
      'American grilled hot dog topped with melted cheddar, and crispy chips in a soft bun. Your choice of Classic, BBQ or Spicy sauces.',
  },
  {
    id: 'roll-escalope',
    name: 'Escalope Chicken',
    price: 350_000,
    description:
      'Breaded chicken, fries, coleslaw, ketchup and mayo garlic sauce in a soft toasted roll.',
  },
  {
    id: 'roll-chicken-teriyaki',
    name: 'Chicken Teriyaki',
    price: 400_000,
    description:
      'Tender chicken strips glazed in sweet teriyaki sauce, cheese, crispy lettuce, tomato, cucumber in soft toasted roll.',
  },
  {
    id: 'roll-philly',
    name: 'Philly Cheesesteak',
    price: 450_000,
    description:
      'Thinly sliced beef grilled with onions and bell peppers, topped with cheese and served in soft toasted roll.',
  },
  {
    id: 'roll-garlic-shrimp',
    name: 'Garlic Shrimp',
    price: 600_000,
    description:
      'Shrimp sautéed in garlic butter with fresh herbs and creamy garlic sauce in soft toasted roll.',
  },
]

/** Add-on price shown after signature rolls. */
export const PAGE2_ROLLS_MEAL_UPGRADE_PRICE = 250_000

export const PAGE2_ROLLS_MEAL_UPGRADE_SUBTEXT = 'Fries & soft drinks'

export const PAGE2_PIZZA: DescLine[] = [
  {
    id: 'pizza-margherita',
    name: 'Margherita',
    price: 700_000,
    description: 'Tomato sauce, oregano and mozzarella cheese.',
  },
  {
    id: 'pizza-vegetarian',
    name: 'Vegetarian',
    price: 750_000,
    description:
      'Tomato sauce, mozzarella cheese, mushrooms, bell peppers, olives, sweet corn, and onions.',
  },
  {
    id: 'pizza-pepperoni',
    name: 'Pepperoni',
    price: 800_000,
    description: 'Tomato sauce, mozzarella cheese, and beef pepperoni.',
  },
  {
    id: 'pizza-bbq-chicken',
    name: 'BBQ Chicken',
    price: 800_000,
    description:
      'Tomato sauce, mozzarella cheese, crispy chicken, sweet corn, BBQ sauce.',
  },
]

export const PAGE2_BURGERS: DescLine[] = [
  {
    id: 'burger-cheese',
    name: 'Cheese Burger',
    price: 650_000,
    description:
      'Juicy grilled beef patty with melty cheddar cheese, chips sticks and honey mustard sauce, in soft brioche bun.',
  },
  {
    id: 'burger-big-lily',
    name: 'Big Lily',
    price: 780_000,
    description:
      'Two beef patties, cheddar cheese, chips, pickles, and cocktail sauce in brioche bun.',
  },
  {
    id: 'burger-mushroom-beef',
    name: 'Mushroom Beef',
    price: 750_000,
    description:
      'Grilled beef patty with creamy sauce, fresh mushroom, chips, honey mustard and cheddar cheese in brioche bun.',
  },
  {
    id: 'burger-crispy-chicken',
    name: 'Crispy Chicken',
    price: 620_000,
    description:
      'Fried chicken, cheddar cheese, iceberg, pickles, tomato, cocktail sauce in soft brioche bun.',
  },
  {
    id: 'burger-buffalo-chicken',
    name: 'Buffalo Chicken',
    price: 680_000,
    description:
      'Fried chicken glazed in spicy buffalo sauce, coleslaw, mayonnaise in soft brioche bun.',
  },
  {
    id: 'burger-bbq-chicken',
    name: 'BBQ Chicken',
    price: 680_000,
    description:
      'Fried chicken glazed in BBQ sauce, iceberg, honey mustard sauce in soft brioche bun.',
  },
]

export const PAGE2_FRENCH_TACOS: DescLine[] = [
  {
    id: 'taco-chicken-strips',
    name: 'Chicken Strips',
    price: 550_000,
    description:
      'Crispy chicken strips, golden fries, melted cheddar cheese sauce, honey mustard, BBQ, and crunchy chips wrapped in toasted tortilla.',
  },
  {
    id: 'taco-lilys-chicken',
    name: "Lilys' Chicken",
    price: 600_000,
    description:
      'Grilled chicken, fries, creamy cheese sauce, cheddar, and ketchup wrapped in toasted tortilla.',
  },
  {
    id: 'taco-beef',
    name: 'Beef',
    price: 650_000,
    description:
      'Seasoned ground beef, fries, creamy cheese sauce, and cocktail sauce wrapped in toasted tortilla.',
  },
]
