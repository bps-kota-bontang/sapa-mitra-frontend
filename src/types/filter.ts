export type Filter = {
  period?: string[];
  team?: string[];
  status?: string[];
  safe?: boolean[];
  category?: string[];
  isSpecial?: boolean[];
  hasSpecial?: boolean[];
  total?: boolean[];
};

type FilterType = "activity" | "contract";

const initialFilterConfig: Record<FilterType, Partial<Filter>> = {
  contract: { team: [], period: [], status: [], safe: [], total: [], hasSpecial: [] },
  activity: { team: [], category: [], isSpecial: [] },
};

const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const createInitialFilter = (type: FilterType): Filter => {
  return deepClone(initialFilterConfig[type]);
}
