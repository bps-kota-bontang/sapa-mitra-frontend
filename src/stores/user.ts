import { getProfile } from '@/api/userApi';
import { da } from 'element-plus/es/locales.mjs';
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
    id: 'user',
    state: () => {
        return {
            id: '',
            name: '',
            nip: '',
            email: '',
            team: '',
            position: '',
        }
    },
    actions: {
        async fetchProfile() {
            try {
                const { data, message } = await getProfile();

                this.$patch({
                    id: data._id,
                    name: data.name,
                    nip: data.nip,
                    email: data.email,
                    team: data.team,
                    position: data.position,
                });
            } catch (e) {
                if (e instanceof Error) console.error(e.message)
            }
        }
    }
})

