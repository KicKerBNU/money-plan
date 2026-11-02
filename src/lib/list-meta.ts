/** Matches API `meta` on expense/income list responses. */
export interface ListMeta {
  limit: number
  returned: number
  truncated: boolean
}

export interface ListedRows<T> {
  rows: T[]
  meta: ListMeta
}

export function normalizeListMeta<T>(data: T[], meta?: ListMeta | null): ListMeta {
  return (
    meta ?? {
      limit: data.length,
      returned: data.length,
      truncated: false,
    }
  )
}
