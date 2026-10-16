import { BASE_URL } from "@/api/api";
import { useAuthStore } from "@/stores/auth";
import type { SKDocument, SKStaff } from "@/types/sk";

const request = async (path: string, init: RequestInit = {}) => {
  const auth = useAuthStore();
  const response = await fetch(`${BASE_URL}/v1/sk${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${auth.token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Permintaan SK gagal");
  return result;
};

export const getSKs = async (): Promise<SKDocument[]> => (await request("")).data;
export const getSK = async (id: string): Promise<SKDocument> => (await request(`/${id}`)).data;
export const syncSKStaff = async (mainActivityId: string): Promise<SKStaff[]> =>
  (await request(`/sync?mainActivityId=${encodeURIComponent(mainActivityId)}`)).data ?? [];
export const createSK = async (payload: Partial<SKDocument>): Promise<SKDocument> =>
  (await request("", { method: "POST", body: JSON.stringify(payload) })).data;
export const updateSK = async (id: string, payload: Partial<SKDocument>): Promise<SKDocument> =>
  (await request(`/${id}`, { method: "PUT", body: JSON.stringify(payload) })).data;
export const deleteSK = async (id: string) => request(`/${id}`, { method: "DELETE" });
