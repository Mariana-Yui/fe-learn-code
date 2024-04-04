import { h, provide, inject } from '../../lib/yui-mini-vue3.esm.js';

/**
 * provide&inject只能在setup中使用, 因为用到了getCurrentInstance()
 */

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal');
    provide('bar', 'barVal');
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(ProviderTwo)]);
  },
};

const ProviderTwo = {
  name: 'ProviderTwo',
  setup() {
    provide('foo', 'fooTwo');
    const foo = inject('foo');
    return {
      foo,
    };
  },
  render() {
    return h('div', {}, [h('p', {}, `ProviderTwo - ${this.foo}`), h(Consumer)]);
  },
};

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo');
    const bar = inject('bar');
    const baz = inject('baz', () => 'defaultValue');

    return {
      foo,
      bar,
      baz,
    };
  },
  render() {
    return h('div', {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`);
  },
};

export const App = {
  name: 'App',
  setup() {
    return {};
  },
  render() {
    return h('div', {}, [h('p', {}, 'apiInject'), h(Provider)]);
  },
};
