import type { Team } from "@/types/user";
import type { Authority } from "@/types/authority";
import type { Partner } from "@/types/partner";
import type { Activity } from "@/types/activity";

export type YearMonth = `${number}-${number}`;

export type StatusContract = "UNVERIFIED" | "VERIFIED";

export type Contract = {
  number: string;
  period: YearMonth;
  authority: Authority;
  partner: Pick<Partner, "name" | "nik" | "address"> & Document;
  activities: (Pick<Activity, "code" | "name" | "unit" | "category"> & {
    startDate: Date;
    endDate: Date;
    volume: number;
    rate: number;
    total: number;
    createdBy: Team;
    status: StatusContract;
  } & Document)[];
  signDate: Date;
  handOverDate: Date;
  penalty: number;
  isExceeded: boolean;
  grandTotal: number;
};
