<template>
  <div class="login-view">
    <div class="login-container">
      <n-modal v-model:show="showModal">
        <n-alert title="Login Support" type="info">
          Please contact your system administrator for login support.
        </n-alert>
      </n-modal>
      <div class="login-header">
        <h1>Welcome Back</h1>
        <p>Please enter your credentials to continue</p>
      </div>

      <n-form id="login-form" @submit.prevent="login">
        <n-input
          id="email"
          class="form-group"
          placeholder="example@terrabuild.ie"
          v-model:value="email"
        />
        <n-input
          id="password"
          class="form-group"
          type="password"
          placeholder="Password"
          v-model:value="password"
        />
      </n-form>

      <n-button-group class="button-group">
        <n-button
          id="helpButton"
          dashed
          class="btn btn-secondary"
          @click="openModal"
        >
          Help
        </n-button>
        <n-button
          id="loginButton"
          type="primary"
          class="btn btn-primary"
          @click="login"
        >
          Login
        </n-button>
      </n-button-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNotification, useLoadingBar } from "naive-ui";

const router = useRouter();
const email = ref("");
const password = ref("");
const showModal = ref(false);
const notification = useNotification();
const loadingBar = useLoadingBar();

const login = () => {
  if (email.value === "" || password.value === "") {
    notification.warning({
      content: "Please fill in all fields",
      duration: 5000,
      keepAliveOnHover: true,
    });
    return;
  }
  loadingBar.start();
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const probableUser = userCredential.user.email.split("@")[0];
      console.info("Welcome " + probableUser);
      notification.success({
        content: "Welcome " + probableUser,
        duration: 2500,
        keepAliveOnHover: true,
      });
      loadingBar.finish();
      router.push("/staff");
    })
    .catch((error) => {
      notification.warning({
        content: error.message,
        duration: 5000,
        keepAliveOnHover: true,
      });
      loadingBar.error();
      console.error(error);
    });
};

const openModal = () => {
  showModal.value = true;
};
</script>

<style scoped lang="scss">
.login-view {
  min-height: calc(100vh - 10.5em);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../../assets/Background1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem 1rem;
}

.login-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  position: relative;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;

  h1 {
    color: #333;
    font-size: 2rem;
    margin-bottom: 0.75rem;
    font-weight: 600;

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }

  p {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.4;

    @media (max-width: 480px) {
      font-size: 0.85rem;
    }
  }
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
}

.btn-primary {
  flex: 2;
}

.btn-secondary {
  flex: 1;
}
</style>
