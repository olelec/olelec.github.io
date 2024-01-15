<template>
  <div id="app">
    <div id="logo">TerraBuild</div>
    <div class="under-construction">
      <img src="../assets/construction.svg" alt="Under Construction" />
      <h1>Under Construction</h1>
      <p>We are working hard to bring you something amazing. Stay tuned!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Allerta+Stencil&display=swap");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.under-construction {
  text-align: center;
}
.under-construction {
  text-align: center;
}

#logo {
  font-family: "Allerta Stencil", sans-serif;
  font-size: 6em;
  color: #fff;
  background: #16ff05;
  padding-left: 0.5em;
  padding-right: 0.5em;
  width: min-content;
  text-align: center;
  margin: 0 auto;
}

h1 {
  color: #333;
}

p {
  color: #555;
}
img {
  padding-top: 10em;
  width: 10%;
}
</style>
