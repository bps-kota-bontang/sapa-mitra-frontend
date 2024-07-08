import { BASE_URL } from "./api";
import { useAuthStore } from "@/stores/auth";

export const getReports = async (period: string) => {
  const auth = useAuthStore();

  const query: any = {};
  if (period) {
    query.period = period;
  }

  const response = await fetch(
    `${BASE_URL}/v1/reports?` + new URLSearchParams(query),
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

export const printReports = async (payload: any) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/reports/print`, {
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
  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = `BAST - ${new Date().valueOf()}.pdf`;

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

export const printReport = async (id: string, number: string, name: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/reports/${id}/print`, {
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

export const createReport = async (payload: any, by: string = "partner") => {
  const auth = useAuthStore();

  let query: any = {};
  if (by == "output") {
    query.by = "output";
  }

  const response = await fetch(
    `${BASE_URL}/v1/reports?` + new URLSearchParams(query),
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

export const deleteReport = async (id: string) => {
  const auth = useAuthStore();

  const response = await fetch(`${BASE_URL}/v1/reports/${id}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message);
  }
};

export const deleteReportOutput = async (id: string, outputId: string) => {
  const auth = useAuthStore();

  const response = await fetch(
    `${BASE_URL}/v1/reports/${id}/output/${outputId}`,
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
