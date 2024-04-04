import { Fragment, createVNode } from '../vnode';

export function renderSlots(slots, name, props) {
  // 具名插槽
  const slot = slots[name];
  if (slot) {
    // 插槽的形式需要是函数
    if (typeof slot === 'function') {
      // props作用域插槽
      return createVNode(Fragment, {}, slot(props));
    }
  }
}
