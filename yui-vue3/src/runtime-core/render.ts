import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  patch(vnode, container);
}

export function patch(vnode, container) {
  if (ShapeFlags.ELEMENT & vnode.shapeFlag) {
    processElement(vnode, container);
  } else if (ShapeFlags.STATEFUL_COMPONENT & vnode.shapeFlag) {
    processComponent(vnode, container);
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function mountElement(initialVnode, container) {
  const el: Element = (initialVnode.el = document.createElement(initialVnode.type));
  // children
  const { children, props } = initialVnode;
  // children string
  if (ShapeFlags.TEXT_CHILDREN & initialVnode.shapeFlag) {
    el.textContent = children;
  } else if (ShapeFlags.ARRAY_CHILDREN & initialVnode.shapeFlag) {
    mountChild(initialVnode, el);
  }

  const isOn = (key) => /^on[A-Z]/.test(key);
  // props
  for (const key in props) {
    const val = props[key];
    // compat event callback and common property
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
  }

  container.append(el);
}

function mountChild(initialVnode, container) {
  initialVnode.children.forEach((v) => {
    patch(v, container);
  });
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(initialVnode, container) {
  const instance = createComponentInstance(initialVnode);

  setupComponent(instance);
  setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance, vnode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  // vnode -> patch
  // now vnode is element -> mountElement
  patch(subTree, container);

  // patch递归此时自底向上, el -> $el 有值
  vnode.el = subTree.el;
}
