import { useAuthStore } from "@/stores/auth";
import { BASE_URL } from "./api";

export const createConfiguration = async (payload: any) => {
    const auth = useAuthStore();

    const body = {
        name: "AUTHORITY",
        value: payload
    }

    const response = await fetch(`${BASE_URL}/v1/configurations/authority`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${auth.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message)
    }

    return result;
};

export const getAuthority = async () => {
    const auth = useAuthStore();

    const response = await fetch(`${BASE_URL}/v1/configurations/authority`, {
        headers: {
            "Authorization": `Bearer ${auth.token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message)
    }

    return result;
};