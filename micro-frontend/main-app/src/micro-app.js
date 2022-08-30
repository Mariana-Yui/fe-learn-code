import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'vueApp',
    entry: '//localhost:8090',
    // entry: 'http://9.134.187.84:5500/micro-frontend/micro-app/dist/index.html',
    container: '#container',
    activeRule: '/app-vue',
  },
]);

start({
  sandbox: {
    // strictStyleIsolation: true, // 严格沙箱
    experimentalStyleIsolation: true, // 实验性沙箱
  },
});
