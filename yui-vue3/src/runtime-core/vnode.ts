import { ShapeFlags } from '../shared/shapeFlags';

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    component: null, // vnode 关联 instance
    key: props && props.key,
    el: null, // this.$el
    shapeFlag: getShapeFlag(type),
  };

  if (typeof vnode.children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(vnode.children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }

  // slots children
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof vnode.children === 'object') {
      vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.SLOT_CHILDREN;
    }
  }
  return vnode;
}

// children为数组时,元素必须是虚拟节点, 所以对于text需要转成虚拟节点
export function createTextVNode(text: string) {
  return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}
