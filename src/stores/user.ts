import { login } from '@/api/authApi'
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
            token: '',
            isLogin: false,
        }
    },
    actions: {
        logout() {
            this.$patch({
                id: '',
                name: '',
                nip: '',
                email: '',
                team: '',
                position: '',
                token: '',
                isLogin: false,
            });

            this.router.push({ "name": "login" })
        },

        async login(payload: any) {
            const result = await login(payload);

            if (result.data) {
                this.$patch({
                    name: result.data.name,
                    nip: result.data.nip,
                    email: result.data.email,
                    team: result.data.team,
                    position: result.data.position,
                    token: result.data.token,
                    isLogin: true,
                });

                this.router.push({ "name": "dashboard" })
            }

            return result;
        }
    },
    persist: true,
})

