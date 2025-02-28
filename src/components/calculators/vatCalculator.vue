<script setup lang="ts">
import { computed, CSSProperties, ref } from "vue";

const inputAmount = ref(0);
const rate = ref(23);
const mode = ref(true);

const rateRailStyle = ({
  checked,
  focused,
}: {
  checked: boolean;
  focused: boolean;
}) => {
  const style: CSSProperties = {};
  if (checked) {
    style.background = "#8C00BF";
    if (focused) {
      style.boxShadow = "0 0 0 2px #59007940";
    }
  } else {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};

const modeRailStyle = (state: { checked: boolean; focused: boolean }) => {
  return {
    background: state.checked ? "#0C5700" : "#d03050",
    boxShadow: state.focused
      ? `0 0 0 2px ${state.checked ? "#08380050" : "#d0305040"}`
      : undefined,
  } as CSSProperties;
};

const calculate = computed(() => {
  if (!rate.value) return [0, 0]; // Prevent errors if rate is 0 or undefined
  if (mode.value) {
    // Add mode
    const rateAmount = inputAmount.value * (rate.value / 100);
    return [rateAmount, inputAmount.value + rateAmount];
  } else {
    // Remove mode
    const percentage = 1 + rate.value / 100;
    const amount = inputAmount.value / percentage;
    const rateAmount = inputAmount.value - amount;
    return [rateAmount, amount];
  }
});

const formattedCalculate = computed(() => {
  return calculate.value.map((num) => (isNaN(num) ? "0.00" : num.toFixed(2)));
});

function updateMode(value: boolean) {
  mode.value = value;
}

function updateVatRate(value: number) {
  rate.value = value;
}
</script>

<template>
  <div class="tax-calculator calculator-helper">
    <h2>VAT Calculator</h2>
    <p>Amount</p>
    <n-input-number :show-button="false" :min="0" v-model:value="inputAmount">
      <template #prefix> € </template>
    </n-input-number>
    <div id="vat-rate">
      <p>VAT Rate</p>
      <n-switch
        :checked-value="23"
        :unchecked-value="13.5"
        :default-value="23"
        :rail-style="rateRailStyle"
        @update:value="updateVatRate"
      >
        <template #checked> 23% </template>
        <template #unchecked> 13.5% </template>
      </n-switch>
    </div>
    <div id="mode">
      <p>Mode</p>
      <n-switch
        :checked-value="true"
        :unchecked-value="false"
        :default-value="true"
        :rail-style="modeRailStyle"
        @update:value="updateMode"
      >
        <template #checked> Add </template>
        <template #unchecked> Remove</template>
      </n-switch>
    </div>
    <p>VAT Amount: €{{ formattedCalculate[0] }}</p>
    <p>
      Total ({{ mode ? "Including VAT" : "Excluding VAT" }}): €{{
        formattedCalculate[1]
      }}
    </p>
    <br />
    <i>
      Calculation formula:
      <template v-if="mode">Amount * ({{ rate }} / 100)</template>
      <template v-else>Amount / (1 + {{ rate }} / 100)</template>
    </i>
  </div>
</template>

<style lang="scss" scoped>
#vat-rate,
#mode {
  display: flex;
  margin: auto;
  justify-content: center;
  gap: 1em;
  padding: 0.5em;
}
</style>
