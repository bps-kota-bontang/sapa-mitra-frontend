import { BASE_URL } from "./api";
import { useUserStore } from "@/stores/user";

export const getUsers = async () => {
    const user = useUserStore();

    const response = await fetch(`${BASE_URL}/v1/users`, {
        headers: {
            "Authorization": `Bearer ${user.token}`,
        }
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message)
    }

    return result.data;
};