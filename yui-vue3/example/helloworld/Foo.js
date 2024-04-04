import { createTextVNode, h } from '../../lib/yui-mini-vue3.esm.js';
import { renderSlots } from '../../lib/yui-mini-vue3.esm.js';

export const Foo = {
  setup(props) {
    props.count++;
    console.log(props);
  },
  render() {
    const foo = 'foo: ' + this.count;
    const age = 10;
    return h('div', {}, [renderSlots(this.$slots, 'header', { age }), createTextVNode(foo), renderSlots(this.$slots, 'footer')]);
  },
};
