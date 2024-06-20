import { BASE_URL } from "./api";
import { useAuthStore } from "@/stores/auth";

export const getContracts = async (period: string) => {
  const auth = useAuthStore();

  const query: any = {}
  if (period) {
    query.period = period
  }

  const response = await fetch(`${BASE_URL}/v1/contracts?` + new URLSearchParams(query), {
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


export const getContractStatistic = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/statistics`, {
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


export const createContract = async (payload: any, by: string = "partner") => {
  const auth = useAuthStore();

  let query: any = {}
  if (by == "activity") {
    query.by = "activity";
  }

  const response = await fetch(`${BASE_URL}/v1/contracts?` + new URLSearchParams(query), {
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

export const deleteContract = async (id: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${auth.token}`
    }
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message)
  }
};


export const verifyContractActivity = async (id: string, activityId: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/${id}/activity/${activityId}/verify`, {
    headers: {
      "Authorization": `Bearer ${auth.token}`
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message)
  }
};

export const deleteContractActivity = async (id: string, activityId: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/${id}/activity/${activityId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${auth.token}`
    }
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message)
  }
};

