import type { Team } from "@/types/user";

export type MainActivity = {
  _id: string;
  name: string;
  year: number;
  isActive: boolean;
  team?: Team[] | null;
  activityCount?: number;
};