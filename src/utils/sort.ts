export type SortState = {
  key: string | null;
  order: "ascending" | "descending" | null;
};

type SortValue = string | number | boolean | null | undefined;

export const createSortState = (): SortState => ({ key: null, order: null });

// Column key comes from column-key, falling back to prop.
export const toSortState = (e: { column?: any; prop?: string; order: string | null }): SortState => ({
  key: e.order ? (e.column?.columnKey || e.prop || null) : null,
  order: (e.order as SortState["order"]) || null,
});

export const sortRows = <T>(
  rows: T[],
  state: SortState,
  getters: Record<string, (row: T) => SortValue>
): T[] => {
  const getter = state.key ? getters[state.key] : undefined;
  if (!getter || !state.order) return rows;

  const dir = state.order === "ascending" ? 1 : -1;

  return [...rows].sort((a, b) => {
    const va = getter(a) ?? "";
    const vb = getter(b) ?? "";

    if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
    if (typeof va === "boolean" && typeof vb === "boolean") return (Number(va) - Number(vb)) * dir;

    return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" }) * dir;
  });
};
