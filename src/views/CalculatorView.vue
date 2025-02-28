<script setup>
import CurrencyConverter from "@/components/calculators/currencyConverter.vue";
import vatCalculator from "@/components/calculators/vatCalculator.vue";
import tenPercentCalculator from "../components/calculators/tenPercentCalculator.vue";
</script>

<template>
  <n-grid id="calculation-tools" x-gap="12" :cols="3">
    <n-gi>
      <vatCalculator />
    </n-gi>
    <n-gi>
      <tenPercentCalculator />
    </n-gi>
    <n-gi>
      <CurrencyConverter />
    </n-gi>
  </n-grid>
</template>

<style lang="scss">
#calculation-tools {
  .calculator-helper {
    height: 30vh;
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
  .n-input-number {
    width: 40%;
    justify-content: center;
    margin: auto;
  }
}
</style>
