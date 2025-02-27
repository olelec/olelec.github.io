<script setup lang="ts">
import { computed, ref } from "vue";

const amountIncVat = ref(0);
const vatRate = ref(23);

const calculateExVat = computed(() => {
  const vatFactor = 1 + vatRate.value / 100;
  const amountExVat = amountIncVat.value / vatFactor;
  const vatAmount = amountIncVat.value - amountExVat;
  return [amountExVat, vatAmount];
});
</script>

<template>
  <div class="tax-calculator calculator-helper">
    <h2>VAT Removal Calculator</h2>
    <p>Amount (Including VAT):</p>
    <n-input-number
      :show-button="false"
      :min="0"
      v-model:value="amountIncVat"
    />

    <p>VAT Rate (%):</p>
    <n-input-number :show-button="false" :min="0" v-model:value="vatRate" />

    <p>VAT Amount: {{ calculateExVat[1].toFixed(2) }}</p>
    <p>Amount (Excluding VAT): {{ calculateExVat[0].toFixed(2) }}</p>
    <br />
    <i>
      Calculation formula: Amount Excluding VAT = Amount Including VAT / (1 +
      VAT Rate / 100)
    </i>
  </div>
</template>
