<script setup>
import CurrencyConverter from "@/components/currencyConverter.vue";
import vatCalculator from "@/components/vatCalculator.vue";
import vatRemovalCalculator from "../components/vatRemovalCalculator.vue";
</script>

<template>
  <n-grid id="calculation-tools" x-gap="12" :cols="3">
    <n-gi>
      <vatCalculator />
    </n-gi>
    <n-gi>
      <vatRemovalCalculator />
    </n-gi>
    <n-gi>
      <CurrencyConverter />
    </n-gi>
  </n-grid>
</template>

<style lang="scss">
#calculation-tools {
  .calculator-helper {
    max-width: 400px;
    margin: auto;
    margin-top: 4em;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
  }
  p {
    font-weight: bold;
  }
}
</style>
