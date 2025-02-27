<script setup lang="ts">
import { RouterView, RouterLink } from "vue-router";
import { useAuthStore } from "./store/authStore";
import { computed, h } from "vue";
import type { MenuOption } from "naive-ui";
import router from "./router";

const authStore = useAuthStore();

const userEmail = computed(() => authStore.getUserEmail);

const menuOptions: MenuOption[] = computed(() => {
  if (router.currentRoute.value.path === "/") {
    return [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: "/#about",
            },
            { default: () => "About" }
          ),
        key: "About",
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: "/#memberships",
            },
            { default: () => "Membership" }
          ),
        key: "Membership",
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: "/#contact",
            },
            { default: () => "Contact" }
          ),
        key: "Contact",
      },
    ];
  } else if (router.currentRoute.value.path.includes("/staff")) {
    return [
      {
        label: "Tools",
        key: "home",
        children: [
          {
            label: () =>
              h(
                RouterLink,
                {
                  to: "/staff/tax-calculator",
                },
                { default: () => "Tax Calculator" }
              ),
            key: "TaxCalculator",
          },
        ],
      },
      { label: "Jobs", key: "jobs" },
      { label: "Admin", key: "admin" },
    ];
  }
});
</script>

<template>
  <body>
    <div class="top-bar">
      <div class="auth-links">
        <RouterLink v-if="userEmail !== ''" to="/staff" class="auth"
          >Staff</RouterLink
        >
        <n-divider v-if="userEmail !== ''" vertical />
        <RouterLink v-if="userEmail !== ''" to="/logout" class="auth"
          >Logout</RouterLink
        >
        <RouterLink v-else to="login" class="auth">Login</RouterLink>
      </div>

      <div class="contact-info">
        <a href="tel:0878126549">📱 087 812 6549</a>
        <a href="mailto:patricia@terrabuild.ie">✉️ patricia@terrabuild.ie</a>
      </div>
    </div>

    <nav>
      <RouterLink to="/" class="logo">TerraBuild</RouterLink>
      <div class="nav-links">
        <n-menu :options="menuOptions" mode="horizontal" />
      </div>
    </nav>
    <n-notification-provider>
      <RouterView />
    </n-notification-provider>
  </body>
</template>

<style lang="scss">
:root {
  --primary: #16ff05;
  --primary-dark: #12cc04;
  --secondary: #2c3e50;
  --light: #f8f9fa;
  --dark: #1a1a1a;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  line-height: 1.6;
  color: var(--dark);
  overflow-x: hidden;
}

.logo {
  font-family: "Allerta Stencil", sans-serif;
  font-size: 2.5rem;
  color: var(--primary);
  text-decoration: none;
}

.top-bar {
  background: var(--secondary);
  color: white;
  padding: 0.5rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  a.auth-links {
    display: flex;
    justify-content: flex-start;
    gap: 2rem;
  }
  .n-divider.n-divider--vertical {
    height: 1.5em;
    margin-bottom: 0.5em;
  }

  .contact-info {
    display: flex;
    justify-content: flex-end;
    gap: 2rem;
  }
}

.top-bar .auth {
  text-align: left;
}

.top-bar a {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
}

.nav-links a {
  margin-left: 2rem;
  color: var(--dark);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary);
}

nav {
  background: white;
  padding: 1rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>
