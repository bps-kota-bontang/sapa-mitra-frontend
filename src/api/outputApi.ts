import { BASE_URL } from "./api";
import { useAuthStore } from "@/stores/auth";

export const getOutputs = async () => {
    const auth = useAuthStore();

    const response = await fetch(`${BASE_URL}/v1/outputs`, {
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

export const deleteOutput = async (id: string) => {
    const auth = useAuthStore();

    const response = await fetch(`${BASE_URL}/v1/outputs/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${auth.token}`,
        }
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message)
    }
};

export const createOutput = async (payload: any) => {
    const auth = useAuthStore();

    const response = await fetch(`${BASE_URL}/v1/outputs`, {
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