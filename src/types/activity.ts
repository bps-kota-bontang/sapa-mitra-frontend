import type { Team } from "@/types/user";

export type CategoryActivity = "ENUMERATION" | "SUPERVISION" | "PROCESSING";

export type Activity = {
  name: string;
  code: string;
  unit: string;
  category: CategoryActivity;
  team: Team;
};
