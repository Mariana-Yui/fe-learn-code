import './public-path';
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

let instance = null;
let router = null;
function render(props = {}) {
  const { container } = props;

  router = createRouter({
    history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/'),
    routes: [
      {
        path: '/',
        name: 'App',
        component: App,
      },
    ],
  });
  instance = createApp(App).use(router);
  instance.mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}

// props 初始化参数
export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);

  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log('[subApp]', state, prev);
  });
  props.setGlobalState({ type: 'submit' });
}

/** [S] 提供给外部调用 */
export async function unmount() {
  instance.unmount();
  instance = null;
  router = null;
}

// 手动loadMicroApp加载微服务时生效
export async function update(props) {
  console.log('update props', props);
}
/** [E] 提供给外部调用 */
