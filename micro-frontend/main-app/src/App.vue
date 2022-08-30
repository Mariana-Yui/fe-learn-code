<template>
  <div class="box">
    <div id="nav">
      <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
      <a @click="gotoAppVue">AppVue</a>
    </div>
    <div id="container"></div>
  </div>
  <router-view />
</template>

<script>
import { initGlobalState, loadMicroApp } from 'qiankun';

const actions = initGlobalState({ you: 'ate a bee' });
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log('[mainApp]', state, prev);
});

export default {
  data: () => ({
    microApp: null,
  }),
  methods: {
    gotoAppVue(e) {
      e.preventDefault();
      window.history.pushState(null, '', '/app-vue/');
    },
  },
  mounted() {
    actions.setGlobalState({ type: 'init' });
  },
  created() {
    this.microApp = loadMicroApp({
      name: 'micro-app',
      entry: 'http://localhost:8090',
      container: '#container',
      props: {
        first_name: 'mariana',
        last_name: 'yui',
      },
    }, {
      sandbox: {
        experimentalStyleIsolation: true,
      },
    });
  },
  unmount() {
    this.microApp.unmount();
  },
};
</script>

<style lang="scss" scoped>
.box {
  color: pink;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
}
</style>
