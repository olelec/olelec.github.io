<script setup lang="ts">
import Navigation from "../components/navigation.vue";
</script>

<template>
  <n-grid id="staff-dashboard" x-gap="12" :cols="4">
    <n-gi
      ><h1>Staff Dashboard</h1>
      <navigation mode="vertical"
    /></n-gi>
    <n-gi> <n-calendar /> </n-gi>
  </n-grid>
</template>

<style lang="scss">
#staff-dashboard {
  .n-menu-item-content-header {
    font-size: 2em;
  }
}
</style>
