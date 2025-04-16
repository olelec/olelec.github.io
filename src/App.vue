<script setup lang="ts">
import { RouterView, RouterLink } from "vue-router";
import { useAuthStore } from "./store/authStore";
import { ref, computed, onMounted } from "vue";
import navigation from "@/components/navigation.vue";

const authStore = useAuthStore();

const userEmail = computed(() => authStore.getUserEmail);

const version = ref<string | null>(null);
const releaseUrl = ref<string | null>(null);

onMounted(async () => {
  try {
    const url = "https://api.github.com/repos/olelec/olelec.github.io/releases";
    const response = await fetch(url);
    const data = await response.json();
    version.value = data[0].tag_name;
    releaseUrl.value = data[0].html_url;
    console.info("Latest release:", version.value, releaseUrl.value);
  } catch (error) {
    console.error("Failed to fetch version:", error);
    version.value = "N/A";
  }
});
</script>

<template>
  <n-config-provider>
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

        <div class="contact-info" v-if="userEmail === ''">
          <a href="tel:0878126549">📱 087 812 6549</a>
          <a href="mailto:enquiries@terrabuild.ie"
            >✉️ enquiries@terrabuild.ie</a
          >
        </div>
        <div :href="releaseUrl" v-else>
          <a
            v-if="userEmail !== '' && releaseUrl"
            :href="releaseUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ version?.toUpperCase() }}
          </a>
        </div>
      </div>

      <nav>
        <RouterLink to="/" class="logo">TerraBuild</RouterLink>
        <div class="nav-links">
          <navigation mode="horizontal" />
        </div>
      </nav>
      <n-loading-bar-provider>
        <n-notification-provider>
          <RouterView />
        </n-notification-provider>
      </n-loading-bar-provider></body
  ></n-config-provider>
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
  // if less than 600px wide stack contact info
  @media (max-width: 600px) {
    .contact-info {
      flex-direction: column;
      gap: 0rem;
    }
  }
  .auth {
    text-align: left;
  }
  a {
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
  }
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
