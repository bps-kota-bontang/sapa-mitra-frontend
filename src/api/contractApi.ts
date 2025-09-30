import { BASE_URL } from "./api";
import { useAuthStore } from "@/stores/auth";

export const getContracts = async (period: string) => {
  const auth = useAuthStore();

  const query: any = {};
  if (period) {
    query.period = period;
  }

  const response = await fetch(
    `${BASE_URL}/v1/contracts?` + new URLSearchParams(query),
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const getContract = async (id: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/${id}`, {
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

export const getContractStatistic = async (year: string = "") => {
  const auth = useAuthStore();

  const query: any = {};
  if (year) {
    query.year = year;
  }

  const response = await fetch(
    `${BASE_URL}/v1/contracts/statistics?` + new URLSearchParams(query),
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const getContractActivityVolume = async (
  outputId: string,
  period: string
) => {
  const auth = useAuthStore();

  const query = {
    outputId: outputId,
    period: period,
  };

  const response = await fetch(
    `${BASE_URL}/v1/contracts/activity/volume?` + new URLSearchParams(query),
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const getContractActivityCost = async (
  activityId: string,
  period: string
) => {
  const auth = useAuthStore();

  const query = {
    activityId: activityId,
    period: period,
  };

  const response = await fetch(
    `${BASE_URL}/v1/contracts/activity/cost?` + new URLSearchParams(query),
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const getContractActivityAccount = async (
  activityId: string,
  period: string
) => {
  const auth = useAuthStore();

  const query = {
    activityId: activityId,
    period: period,
  };

  const response = await fetch(
    `${BASE_URL}/v1/contracts/activity/account?` + new URLSearchParams(query),
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const printContracts = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/print`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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
  a.download = `SPK - ${new Date().valueOf()}.pdf`;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const printContract = async (
  id: string,
  number: string,
  name: string
) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/${id}/print`, {
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

  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = `${number}_${name}.pdf`;

  if (contentDisposition) {
    const matches = contentDisposition.match(/filename="(.+)"/);
    if (matches && matches[1]) {
      filename = matches[1];
    }
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const createContract = async (payload: any, by: string = "partner") => {
  const auth = useAuthStore();

  let query: any = {};
  if (by == "activity") {
    query.by = "activity";
  }

  const response = await fetch(
    `${BASE_URL}/v1/contracts?` + new URLSearchParams(query),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

export const deleteContract = async (id: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/${id}`, {
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

export const verifyContractActivity = async (
  id: string,
  activityId: string
) => {
  const auth = useAuthStore();

  const response = await fetch(
    `${BASE_URL}/v1/contracts/${id}/activity/${activityId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }
};

export const cancelContractActivity = async (
  id: string,
  activityId: string
) => {
  const auth = useAuthStore();

  const response = await fetch(
    `${BASE_URL}/v1/contracts/${id}/activity/${activityId}/cancel`,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }
};

export const deleteContractActivity = async (
  id: string,
  activityId: string
) => {
  const auth = useAuthStore();

  const response = await fetch(
    `${BASE_URL}/v1/contracts/${id}/activity/${activityId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message);
  }
};

export const downloadTemplatePartner = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/partner/template`, {
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
  a.download = `Template Import Partner in Contract.csv`;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const downloadTemplatePartnerCost = async () => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/cost/template`, {
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
  a.download = `Template Import Partner Cost in Contract.csv`;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const getContractActivity = async (id: string, activityId: string) => {
  const auth = useAuthStore();

  const response = await fetch(
    `${BASE_URL}/v1/contracts/${id}/activity/${activityId}`,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
};

export const updateContractActivity = async (
  id: string,
  activityId: string,
  payload: any
) => {
  const auth = useAuthStore();

  const response = await fetch(
    `${BASE_URL}/v1/contracts/${id}/activity/${activityId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

export const downloadContracts = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/download`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result: any = await response.json();
    throw new Error(result.message);
  }

  const blob = await response.blob();

  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = `Master Data Contract.csv`;

  if (contentDisposition) {
    const matches = contentDisposition.match(/filename="(.+)"/);
    if (matches && matches[1]) {
      filename = matches[1];
    }
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const updateContract = async (id: string, payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

export const updateContractActivityCost = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/activity/cost`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

export const updateContractActivityRecap = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/activity/recap`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

export const downloadRecapActivity = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/contracts/activity/recap`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result: any = await response.json();
    throw new Error(result.message);
  }

  const blob = await response.blob();

  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = `Rekap - ${new Date().valueOf()}.pdf`;

  if (contentDisposition) {
    const matches = contentDisposition.match(/filename="(.+)"/);
    if (matches && matches[1]) {
      filename = matches[1];
    }
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
