import { createApp } from "vue";
import { VueFire, VueFireAuth } from "vuefire";
import App from "./App.vue";
import { firebaseApp } from "./firebase";
import router from "./router";
import naive from "naive-ui";
import { createPinia } from "pinia";

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.use(router);
app.use(naive);

app.mount("#app");
