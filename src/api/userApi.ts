import { useUserStore } from "@/stores/user";
import { BASE_URL } from "./api";
import { useAuthStore } from "@/stores/auth";
import { JsxEmit } from "typescript";

export const getUsers = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/users`, {
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

export const getProfile = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/users/me`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

export const updatePassword = async (payload: any) => {
  const auth = useAuthStore();
  const user = useUserStore();

  const response = await fetch(`${BASE_URL}/v1/users/${user.id}/password`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    method: "PUT",
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};
