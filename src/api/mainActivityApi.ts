import { BASE_URL } from "@/api/api";
import { useAuthStore } from "@/stores/auth";
import type { MainActivity } from "@/types/mainActivity";
import type { Team } from "@/types/user";

const request = async (path: string, init: RequestInit = {}) => {
  const auth = useAuthStore();
  const response = await fetch(`${BASE_URL}/v1/main-activities${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${auth.token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
};

export const getMainActivities = async (year?: number | string, activeOnly = false, team?: string): Promise<MainActivity[]> => {
  const query = new URLSearchParams();
  if (year) query.set("year", String(year));
  if (activeOnly) query.set("active", "true");
  if (team) query.set("team", team);
  const result = await request(`?${query.toString()}`);
  return result.data;
};

export const createMainActivity = async (payload: Pick<MainActivity, "name" | "year"> & { team: Team[] }) =>
  request("", { method: "POST", body: JSON.stringify(payload) });

export const updateMainActivity = async (id: string, payload: Partial<MainActivity>) =>
  request(`/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteMainActivity = async (id: string) =>
  request(`/${id}`, { method: "DELETE" });