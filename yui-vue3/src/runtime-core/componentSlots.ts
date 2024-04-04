import { ShapeFlags } from '../shared/shapeFlags';

export function initSlots(instance, children) {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children: any, slots: any) {
  // 组件的slots必须是对象
  for (const key in children) {
    const value = children[key];
    // 作用域插槽
    slots[key] = (props) => normalizeSlotValue(value(props));
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
