<script setup lang="ts">
import { RouterLink } from "vue-router";
import { computed, h, defineProps } from "vue";
import type { MenuOption } from "naive-ui";
import router from ".././router";

defineProps({
  mode: {
    type: String,
    required: true,
  },
});

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
  } else if (router.currentRoute.value.path.includes("/staff")) {
    return [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: "/staff/calculator",
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
              to: "/staff/documents",
            },
            { default: () => "Documents" }
          ),
        key: "Documents",
      },
    ];
  }
});
</script>

<template>
  <n-menu :options="menuOptions" :mode="mode" />
</template>
