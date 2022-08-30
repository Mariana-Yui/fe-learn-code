import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// import './micro-app'; // 改变路由的注册方式

createApp(App).use(router).mount('#app');
