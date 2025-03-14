import { BASE_URL } from "./api";
import { useAuthStore } from "@/stores/auth";

export const getStatuses = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/statuses`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const getStatus = async (period: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/statuses/${period}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const updateStatusContract = async (
  period: string,
  isLocked: boolean
) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/statuses/${period}/contract`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    method: "PUT",
    body: JSON.stringify({
      is_locked: isLocked,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }
};

export const updateStatusOutput = async (period: string, isLocked: boolean) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/statuses/${period}/output`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    method: "PUT",
    body: JSON.stringify({
      is_locked: isLocked,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }
};
