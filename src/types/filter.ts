export type Filter = {
  period?: string[];
  team?: string[];
  status?: string[];
  limit?: boolean[];
  category?: string[];
  total?: boolean[];
};

type FilterType = "activity" | "contract";

const initialFilterConfig: Record<FilterType, Partial<Filter>> = {
  contract: { team: [], period: [], status: [], limit: [], total: [] },
  activity: { team: [], category: [] },
};

const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const createInitialFilter = (type: FilterType): Filter => {
  return deepClone(initialFilterConfig[type]);
}
