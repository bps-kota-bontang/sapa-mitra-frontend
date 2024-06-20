import { BASE_URL } from "./api";
import { useAuthStore } from "@/stores/auth";

export const getReports = async (period: string) => {
  const auth = useAuthStore();

  const query: any = {}
  if (period) {
    query.period = period
  }

  const response = await fetch(`${BASE_URL}/v1/reports?` + new URLSearchParams(query), {
    headers: {
      "Authorization": `Bearer ${auth.token}`,
    }
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message)
  }

  return result.data;
};

export const createReport = async (payload: any, by: string = "partner") => {
  const auth = useAuthStore();

  let query: any = {}
  if (by == "output") {
    query.by = "output";
  }

  const response = await fetch(`${BASE_URL}/v1/reports?` + new URLSearchParams(query), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${auth.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message)
  }

  return result;
};

export const deleteReport = async (id: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/reports/${id}`, {
    headers: {
      "Authorization": `Bearer ${auth.token}`,
    },
    method: "DELETE"
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message)
  }
};

export const deleteReportOutput = async (id: string, outputId: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/reports/${id}/output/${outputId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${auth.token}`,
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message)
  }
};

