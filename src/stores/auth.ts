import { login, loginSso } from "@/api/authApi";
import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => {
    return {
      token: "",
      isLogin: false,
    };
  },
  actions: {
    logout() {
      this.$patch({
        token: "",
        isLogin: false,
      });

      this.router.push({ name: "login" });
    },

    async login(payload: any) {
      const result = await login(payload);

      if (result.data) {
        this.$patch({
          token: result.data.token,
          isLogin: true,
        });

        this.router.push({ name: "dashboard" });
      }

      return result;
    },

    async loginSso(token: any) {
      const result = await loginSso(token);

      if (result.data) {
        this.$patch({
          token: token,
          isLogin: true,
        });

        this.router.push({ name: "dashboard" });
      }

      return result;
    },
  },
  persist: true,
});
