import { BASE_URL } from "./api";
import { useAuthStore } from "@/stores/auth";

export const getUsers = async () => {
    const auth = useAuthStore();

    const response = await fetch(`${BASE_URL}/v1/users`, {
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

export const getProfile = async () => {
    const auth = useAuthStore();

    const response = await fetch(`${BASE_URL}/v1/users/me`, {
        headers: {
            "Authorization": `Bearer ${auth.token}`,
        }
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message)
    }

    return result;
};