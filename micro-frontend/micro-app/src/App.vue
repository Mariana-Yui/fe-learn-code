<template>
  <div class="micro-app">
    <h1>This is an micro-app page</h1>
    <h2>window.__POWERED_BY_QIANKUN: {{ poweredByQiankun }}</h2>
  </div>
</template>

<script>
export default {
  computed: {
    poweredByQiankun() {
      return window.__POWERED_BY_QIANKUN__;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>