<script setup lang="ts">
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNotification, useLoadingBar } from "naive-ui";
import { onMounted, ref } from "vue";

const notification = useNotification();
const loadingBar = useLoadingBar();
dayjs.extend(relativeTime);

const amount = ref(1);
const fromCurrency = ref("GBP");
const toCurrency = ref("EUR");
const exchangeRates = ref<Record<string, number>>({});
const convertedAmount = ref<number | null>(null);
const currencyOptions = ref<{ value: string; label: string }[]>([]);
const timestamp = ref("Fetching...");
const errorGettingData = ref(false);

async function fetchExchangeRates() {
  loadingBar.start();
  try {
    const responseRaw = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const response = await responseRaw.json();

    if (!response.rates) throw new Error("Invalid API response");

    exchangeRates.value = response.rates;
    timestamp.value = dayjs.unix(response.time_last_updated).toISOString();

    currencyOptions.value = Object.keys(response.rates)
      .filter((currency) => ["USD", "EUR", "GBP"].includes(currency))
      .map((currency) => ({ value: currency, label: currency }));

    errorGettingData.value = false;
    loadingBar.finish();
  } catch (error) {
    loadingBar.error();
    console.error("Error fetching exchange rates:", error);
    notification.error({
      content: "Error fetching exchange rates",
    });
    errorGettingData.value = true;
  }
}

async function convertCurrency() {
  await fetchExchangeRates();
  if (dayjs(timestamp.value).isBefore(dayjs().subtract(18, "hours"))) {
    notification.warning({
      content: `Currency Exchange last updated ${dayjs(
        timestamp.value
      ).fromNow()}`,
      duration: 2500,
    });
  }

  if (fromCurrency.value === toCurrency.value) {
    convertedAmount.value = Number(amount.value);
  } else {
    const fromRate = exchangeRates.value[fromCurrency.value];
    const toRate = exchangeRates.value[toCurrency.value];
    convertedAmount.value = (Number(amount.value) / fromRate) * toRate;
  }
}

function resetValue() {
  convertedAmount.value = null;
}

onMounted(fetchExchangeRates);
</script>

<template>
  <div class="converter calculator-helper">
    <h2>Currency Converter</h2>
    <p>Amount</p>
    <div>
      <n-input-number
        v-model:value="amount"
        :show-button="false"
        :min="0"
        :disabled="errorGettingData"
        placeholder="Enter amount"
      >
        <template #suffix> {{ fromCurrency }} </template></n-input-number
      >
      <div id="currency-selection">
        <n-select
          :disabled="errorGettingData"
          v-model:value="fromCurrency"
          :options="currencyOptions"
          @update:value="resetValue"
        />
        <span>to</span>
        <n-select
          :disabled="errorGettingData"
          v-model:value="toCurrency"
          :options="currencyOptions"
          @update:value="resetValue"
        />
      </div>
      <n-button :disabled="errorGettingData" @click="convertCurrency"
        >Convert</n-button
      >
    </div>
    <div v-if="convertedAmount !== null">
      <h3>
        {{ convertedAmount.toFixed(2) }}
        {{ toCurrency }}
      </h3>
    </div>
  </div>
</template>

<style scoped lang="scss">
#currency-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1em 0;
  gap: 0.75em;
}
</style>
