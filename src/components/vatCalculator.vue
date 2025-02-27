<script setup lang="ts">
import { computed, ref } from "vue";

const amountExVat = ref(0);
const vatRate = ref(23);

const calculateVat = computed(() => {
  const vatAmount = amountExVat.value * (vatRate.value / 100);
  return [vatAmount, amountExVat.value + vatAmount];
});
</script>

<template>
  <div class="tax-calculator calculator-helper">
    <h2>VAT Calculator</h2>
    <p>Amount (Excluding VAT):</p>
    <n-input-number :show-button="false" :min="0" v-model:value="amountExVat" />

    <p>VAT Rate (%):</p>
    <n-input-number :show-button="false" :min="0" v-model:value="vatRate" />

    <p>VAT Amount: {{ calculateVat[0].toFixed(2) }}</p>
    <p>Total (Including VAT): {{ calculateVat[1].toFixed(2) }}</p>
    <br />
    <i>
      Calculation formula: VAT Amount = Amount Excluding VAT * (VAT Rate / 100)
    </i>
  </div>
</template>
