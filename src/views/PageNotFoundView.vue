<template>
  <div class="container">
    <div class="construction-icon">🏗️</div>
    <div class="error-code">404</div>
    <h1 class="message">Page Not Found</h1>
    <p class="description">
      We're sorry, but the page you're looking for seems to be under
      construction or has been moved. Please check the URL or return to our
      homepage to continue exploring TerraBuild's services.
    </p>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  margin: auto;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  font-family: "Allerta Stencil", sans-serif;
  color: var(--primary);
  margin-bottom: 1rem;
  line-height: 1;
  position: relative;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.message {
  font-family: "Allerta Stencil", sans-serif;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #555;
}

.description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.construction-icon {
  font-size: 4rem;
  margin-bottom: 2rem;
  color: var(--primary);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .message {
    font-size: 1.2rem;
  }

  .description {
    font-size: 1rem;
  }
}
</style>
