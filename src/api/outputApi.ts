import { BASE_URL } from "./api";
import { useAuthStore } from "@/stores/auth";

export const getOutput = async (id: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/outputs/${id}`, {
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

export const updateOutput = async (id: string, payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/outputs/${id}`, {
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

export const getOutputs = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/outputs`, {
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

export const deleteOutputs = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/outputs`, {
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

export const deleteOutput = async (id: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/outputs/${id}`, {
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

export const createOutput = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/outputs`, {
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

export const downloadOutputTemplate = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/outputs/template`, {
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
  a.download = `Template Output.csv`;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
