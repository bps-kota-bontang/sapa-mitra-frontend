import type { Team } from "@/types/user";

export type CategoryActivity = "ENUMERATION" | "SUPERVISION" | "PROCESSING";

export type Activity = {
  _id?: string;
  main?: string;
  legacyMain?: string;
  mainActivityId?: string;
  mainActivity?: { _id: string; name: string; year: number; isActive: boolean } | null;
  name: string;
  code: string;
  unit: string;
  category: CategoryActivity;
  team: Team;
  isSpecial: boolean
};
