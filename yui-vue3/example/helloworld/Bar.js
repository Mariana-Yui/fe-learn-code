import { h } from '../../lib/yui-mini-vue3.esm.js';

export const Bar = {
  name: 'Bar',
  setup(props, { emit }) {
    const emitAdd = () => {
      emit('add', 1, 2);
      emit('foo-bar');
      return;
    };

    return {
      emitAdd,
    };
  },
  render() {
    const btn = h('button', { onClick: this.emitAdd }, 'emitAdd');
    const foo = h('p', {}, 'bar');

    return h('div', {}, [foo, btn]);
  },
};
