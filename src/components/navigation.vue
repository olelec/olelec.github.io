<script setup lang="ts">
import { RouterLink } from "vue-router";
import { computed, h, defineProps } from "vue";

// use auth store
import { useAuthStore } from "../store/authStore";
const authStore = useAuthStore();

defineProps({
  mode: {
    type: String,
    required: true,
  },
});

const menuOptions = computed(() => {
  if (authStore.getUserEmail) {
    return [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: "/calculator",
            },
            { default: () => "Calculators" }
          ),
        key: "Calculator",
      },

      {
        label: () =>
          h(
            RouterLink,
            {
              to: "/documents",
            },
            { default: () => "Documents" }
          ),
        key: "Documents",
      },
    ];
  } else {
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
              to: "/#work",
            },
            { default: () => "Work" }
          ),
        key: "Work",
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
  }
});
</script>

<template>
  <n-menu :options="menuOptions" :mode="mode" />
</template>
