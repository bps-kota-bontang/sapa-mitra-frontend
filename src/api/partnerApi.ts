import { BASE_URL } from "./api";
import { useUserStore } from "@/stores/user";

export const getPartners = async () => {
    const user = useUserStore();

    const response = await fetch(`${BASE_URL}/v1/partners`, {
        headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json"
        },
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message)
    }

    return result.data;
};

export const deletePartner = async (id: string) => {
    const user = useUserStore();

    const response = await fetch(`${BASE_URL}/v1/partners/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${user.token}`,
        }
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message)
    }
};

export const createPartner = async (payload: any) => {
    const user = useUserStore();

    const response = await fetch(`${BASE_URL}/v1/partners`, {
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