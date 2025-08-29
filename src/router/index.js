import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/auth/LoginView.vue";
import StaffView from "../views/StaffView.vue";
import CalculatorView from "../views/CalculatorView.vue";
import PageNotFoundView from "../views/PageNotFoundView.vue";
import StaffDashboardView from "../views/StaffDashboardView.vue";
import DocumentsView from "../views/DocumentsView.vue";

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
      name: "staff-dashboard",
      component: StaffDashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/calculator",
      name: "Calculator",
      component: CalculatorView,
    },
    {
      path: "/documents",
      name: "Documents",
      component: DocumentsView,
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
        const authStore = useAuthStore();
        authStore.SET_USER_EMAIL("");
        authStore.SET_AUTH_TOKEN("");
        next("/login");
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: PageNotFoundView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }
    return { top: 0 };
  },
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
    const authStore = useAuthStore();
    const currentUser = await waitForAuthState();
    if (currentUser) {
      authStore.SET_USER_EMAIL(currentUser.email);
      authStore.SET_AUTH_TOKEN(currentUser.accessToken);
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
