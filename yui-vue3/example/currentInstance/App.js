import { getCurrentInstance, h } from '../../lib/yui-mini-vue3.esm.js';
import { Foo } from './Foo.js';

export const App = {
  name: 'App',
  render() {
    return h('div', {}, [h(Foo)]);
  },
  setup() {
    const instance = getCurrentInstance();
    console.log('App:', instance);
    return {};
  },
};
