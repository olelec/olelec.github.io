<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <body>
    <div class="top-bar">
      <a href="tel:0878126549">📱 087 812 6549</a>
      <a href="mailto:patricia@terrabuild.ie">✉️ patricia@terrabuild.ie</a>
    </div>

    <nav>
      <a href="#" class="logo">TerraBuild</a>
      <div class="nav-links">
        <a href="#about">About</a>
        <a href="#memberships">Memberships</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
    <RouterView />
  </body>
</template>

<style>
:root {
  --primary: #16ff05;
  --primary-dark: #12cc04;
  --secondary: #2c3e50;
  --light: #f8f9fa;
  --dark: #1a1a1a;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", sans-serif;
  line-height: 1.6;
  color: var(--dark);
  overflow-x: hidden;
}

.logo {
  font-family: "Allerta Stencil", sans-serif;
  font-size: 2.5rem;
  color: var(--primary);
  text-decoration: none;
}

.top-bar {
  background: var(--secondary);
  color: white;
  padding: 0.5rem 5%;
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
}

.top-bar a {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
}

.nav-links a {
  margin-left: 2rem;
  color: var(--dark);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary);
}

nav {
  background: white;
  padding: 1rem 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>
