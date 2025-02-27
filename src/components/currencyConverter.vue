<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      amount: 1,
      fromCurrency: "GBP",
      toCurrency: "EUR",
      exchangeRates: {},
      convertedAmount: null,
      currencyOptions: [],
      timestamp: "Fetching...",
    };
  },
  methods: {
    async fetchExchangeRates() {
      try {
        const responseRaw = await fetch("https://api.fxratesapi.com/latest");
        const response = await responseRaw.json();
        this.exchangeRates = response.rates;
        this.timestamp = dayjs(response.date).format("HH:mm DD/MM/YYYY");
        this.currencyOptions = Object.keys(this.exchangeRates).map(
          (exchangeRate) => {
            return {
              value: exchangeRate,
              label: exchangeRate,
            };
          }
        );
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    },
    convertCurrency() {
      if (this.fromCurrency === this.toCurrency) {
        this.convertedAmount = this.amount;
      } else {
        const rate =
          this.exchangeRates[this.toCurrency] /
          this.exchangeRates[this.fromCurrency];
        this.convertedAmount = this.amount * rate;
      }
    },
  },
  mounted() {
    this.fetchExchangeRates();
  },
};
</script>

<template>
  <div class="converter calculator-helper">
    <h2>Currency Converter</h2>
    Last Updated: {{ timestamp }}
    <div>
      <n-input-number
        v-model:value="amount"
        :show-button="false"
        :min="0"
        placeholder="Enter amount"
      />
      <n-select v-model:value="fromCurrency" :options="currencyOptions" />
      <span>to</span>
      <n-select v-model:value="toCurrency" :options="currencyOptions" />
      <n-button @click="convertCurrency">Convert</n-button>
    </div>
    <div v-if="convertedAmount !== null">
      <h3>
        {{ amount }} {{ fromCurrency }} = {{ convertedAmount.toFixed(2) }}
        {{ toCurrency }}
      </h3>
    </div>
  </div>
</template>
