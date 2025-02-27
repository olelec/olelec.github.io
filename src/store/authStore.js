import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    email: "",
    authToken: "",
  }),
  getters: {
    getUserEmail: (state) => state.email,
    getAuthToken: (state) => state.authToken,
  },
  actions: {
    SET_USER_EMAIL(email) {
      this.email = email;
    },
    SET_AUTH_TOKEN(token) {
      this.authToken = token;
    },
  },
});
