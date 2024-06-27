import { BASE_URL } from "./api";
import { useAuthStore } from "@/stores/auth";

export const getPartners = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/partners`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const deletePartners = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/partners`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message);
  }
};

export const deletePartner = async (id: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/partners/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message);
  }
};

export const createPartner = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/partners`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};
