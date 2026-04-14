import type { BeverageRow, BevSimpleLine } from './beveragesMenuData'
import { MENU_ITEMS } from './menuData'
import type { DescLine, SaladLine, SimpleLine } from './menuPage2Data'
import {
  PAGE2_BOWL,
  PAGE2_BURGERS,
  PAGE2_FRENCH_TACOS,
  PAGE2_PIZZA,
  PAGE2_ROLLS_MEAL_UPGRADE_PRICE,
  PAGE2_ROLLS_MEAL_UPGRADE_SUBTEXT,
  PAGE2_SALADS,
  PAGE2_SHARING,
  PAGE2_SIGNATURE_ROLLS,
  PAGE2_STARTERS_LEFT,
  PAGE2_STARTERS_NOTE,
  PAGE2_STARTERS_RIGHT,
  PAGE2_WOK,
} from './menuPage2Data'
import type { MenuItem } from './types'
import {
  BEVERAGES_BLACK_COFFEE,
  BEVERAGES_BLENDED,
  BEVERAGES_DRINKS,
  BEVERAGES_HOT,
  BEVERAGES_ICED,
  BEVERAGES_NARGILEH,
} from './beveragesMenuData'

export type Page2Catalog = {
  startersLeft: SimpleLine[]
  startersRight: SimpleLine[]
  startersNote: string
  sharing: DescLine[]
  salads: SaladLine[]
  wok: DescLine[]
  bowl: DescLine[]
  signatureRolls: DescLine[]
  pizza: DescLine[]
  burgers: DescLine[]
  frenchTacos: DescLine[]
  rollsMealUpgradePrice: number
  rollsMealUpgradeSubtext: string
}

export type BeveragesCatalog = {
  blackCoffee: BeverageRow[]
  hot: BeverageRow[]
  blended: BeverageRow[]
  iced: BeverageRow[]
  drinks: BevSimpleLine[]
  nargileh: BevSimpleLine[]
}

export type FullMenuCatalog = {
  greenMenu: MenuItem[]
  page2: Page2Catalog
  beverages: BeveragesCatalog
}

function cloneLines<T extends { id: string }>(rows: T[]): T[] {
  return rows.map((row) => ({ ...row }))
}

function cloneSalads(rows: SaladLine[]): SaladLine[] {
  return rows.map((row) => ({
    ...row,
    addOns: row.addOns?.map((a) => ({ ...a })),
  }))
}

export function defaultFullMenuCatalog(): FullMenuCatalog {
  return {
    greenMenu: MENU_ITEMS.map((item) => ({ ...item })),
    page2: {
      startersLeft: cloneLines(PAGE2_STARTERS_LEFT),
      startersRight: cloneLines(PAGE2_STARTERS_RIGHT),
      startersNote: PAGE2_STARTERS_NOTE,
      sharing: cloneLines(PAGE2_SHARING),
      salads: cloneSalads(PAGE2_SALADS),
      wok: cloneLines(PAGE2_WOK),
      bowl: cloneLines(PAGE2_BOWL),
      signatureRolls: cloneLines(PAGE2_SIGNATURE_ROLLS),
      pizza: cloneLines(PAGE2_PIZZA),
      burgers: cloneLines(PAGE2_BURGERS),
      frenchTacos: cloneLines(PAGE2_FRENCH_TACOS),
      rollsMealUpgradePrice: PAGE2_ROLLS_MEAL_UPGRADE_PRICE,
      rollsMealUpgradeSubtext: PAGE2_ROLLS_MEAL_UPGRADE_SUBTEXT,
    },
    beverages: {
      blackCoffee: cloneLines(BEVERAGES_BLACK_COFFEE),
      hot: cloneLines(BEVERAGES_HOT),
      blended: cloneLines(BEVERAGES_BLENDED),
      iced: cloneLines(BEVERAGES_ICED),
      drinks: cloneLines(BEVERAGES_DRINKS),
      nargileh: cloneLines(BEVERAGES_NARGILEH),
    },
  }
}
