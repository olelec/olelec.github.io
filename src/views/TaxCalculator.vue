<script setup>
import { computed, ref } from "vue";

const amountIncVat = ref(0);
const amountExVat = ref(0);
const vatRate = ref(23);

const calculateVat = computed(() => {
  const vatAmount = amountExVat.value * (vatRate.value / 100);
  return [vatAmount, amountExVat.value + vatAmount];
});
const calculateExVat = computed(() => {
  const vatFactor = 1 + vatRate.value / 100;
  const amountExVat = amountIncVat.value / vatFactor;
  const vatAmount = amountIncVat.value - amountExVat;
  return [amountExVat, vatAmount];
});
</script>

<template>
  <div class="tax-calculator">
    <h2>VAT Calculator</h2>
    <p>Amount (Excluding VAT):</p>
    <n-input-number :show-button="false" :min="0" v-model:value="amountExVat" />

    <p>VAT Rate (%):</p>
    <n-input-number :show-button="false" :min="0" v-model:value="vatRate" />

    <p>VAT Amount: {{ calculateVat[0].toFixed(2) }}</p>
    <p>Total (Including VAT): {{ calculateVat[1].toFixed(2) }}</p>
  </div>

  <div class="tax-calculator">
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
  </div>
</template>

<style scoped>
.tax-calculator {
  max-width: 300px;
  margin: auto;
  margin-top: 4em;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}
input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}
p {
  font-weight: bold;
}
</style>
