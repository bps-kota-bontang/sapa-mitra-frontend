import { useUserStore } from "@/stores/user";
import { BASE_URL } from "./api";

export const login = async (payload: any) => {
    const user = useUserStore();

    const response = await fetch(`${BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${user.token}`,
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