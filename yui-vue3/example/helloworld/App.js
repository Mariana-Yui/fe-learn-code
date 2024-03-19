import { h } from '../../lib/yui-mini-vue3.esm.js';
import { Bar } from './Bar.js';
import { Foo } from './Foo.js';

window.self = null;
export const App = {
  name: 'App',
  render() {
    window.self = this;
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'bold'],
        onClick(event) {
          // console.log('click');
        },
        onMousedown(event) {
          // console.log('mousedown');
        },
      },
      [
        h('div', {}, 'hi ' + this.msg),
        h(Foo, { count: 1 }),
        h(Bar, {
          onAdd(a, b) {
            console.log('onAdd', a, b);
          },
          onFooBar() {
            console.log('onFooBar');
          },
        }),
      ],
      // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mini-vue')]
    );
  },
  setup() {
    return {
      msg: 'mini-vue-hahaha',
    };
  },
};
