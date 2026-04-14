export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  sortOrder: number
  /** Shown once under the category list (e.g. *served as manakish or saj*). */
  categoryFooter?: string
}
