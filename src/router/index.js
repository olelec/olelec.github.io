import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/auth/LoginView.vue";
import StaffView from "../views/StaffView.vue";
import { useMainStore } from "../store";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/staff",
      name: "staff",
      component: StaffView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/logout",
      name: "logout",
      beforeEnter: (to, from, next) => {
        getAuth().signOut();
        const mainStore = useMainStore();
        mainStore.SET_USER_EMAIL("");
        mainStore.SET_AUTH_TOKEN("");
        next("/login");
      },
    },
  ],
});

function waitForAuthState() {
  return new Promise((resolve) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Prevent multiple triggers
        resolve(user);
      },
      (error) => {
        console.error("Auth state error:", error);
        resolve(null); // Prevent navigation break
      }
    );
  });
}

// Router Guard with better error handling
router.beforeEach(async (to, from, next) => {
  try {
    const mainStore = useMainStore();
    const currentUser = await waitForAuthState();
    if (currentUser) {
      mainStore.SET_USER_EMAIL(currentUser.email);
      mainStore.SET_AUTH_TOKEN(currentUser.accessToken);
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    if (requiresAuth && !currentUser) {
      console.warn("User does not have permission, redirecting to home.");
      return next({ name: "home" });
    }

    next();
  } catch (error) {
    console.error("Navigation guard error:", error);
    next(false);
  }
});

export default router;
