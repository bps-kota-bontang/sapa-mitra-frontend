export type SKPosition = "PENDATAAN" | "PEMERIKSAAN" | "PENGOLAHAN";
export type SKStaffSource = "PARTNER" | "MANUAL";

export type SKStaff = {
  source: SKStaffSource;
  partnerNik?: string;
  activityId?: string;
  activityName?: string;
  activityCode?: string;
  name: string;
  title: string;
  position: SKPosition;
  honorRate: number | null;
};

export type SKDocument = {
  _id: string;
  number: string;
  date: string | Date;
  mainActivityId: string;
  mainActivityName: string;
  year: number;
  team: string[];
  staff: SKStaff[];
  createdAt?: string;
};
