/**
 * Maps category display names (case-insensitive) to FontAwesome icon names
 * registered in `plugins/fontawesome.ts`. Unknown names use `tag`.
 */
const NAME_TO_ICON: Record<string, string> = {
  rent: 'house',
  pension: 'piggy-bank',
  food: 'utensils',
  'social life': 'users',
  pets: 'paw',
  transport: 'bus',
  culture: 'palette',
  household: 'brush',
  apparel: 'shirt',
  beauty: 'wand-magic-sparkles',
  health: 'heart-pulse',
  education: 'graduation-cap',
  gift: 'gift',
  other: 'ellipsis',
}

export function categoryIconForName(name: string): string {
  const key = name.trim().toLowerCase()
  return NAME_TO_ICON[key] ?? 'tag'
}
