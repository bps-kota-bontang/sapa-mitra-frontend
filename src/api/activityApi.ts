import { useAuthStore } from "@/stores/auth";
import { BASE_URL } from "./api";

export const getActivity = async (id: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/activities/${id}`, {
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

export const updateActivity = async (id: string, payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/activities/${id}`, {
    method: "PUT",
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

export const getActivities = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/activities`, {
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

export const deleteActivities = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/activities`, {
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

export const deleteActivity = async (id: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/activities/${id}`, {
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

export const createActivity = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/activities`, {
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

export const downloadActivityTemplate = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/activities/template`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const result: any = await response.json();
    throw new Error(result.message);
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `Template Kegiatan.csv`;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
