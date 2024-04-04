import { createRenderer } from '../runtime-core';

function createElement(type) {
  return document.createElement(type);
}

function patchProp(el, key, prevVal, nextVal) {
  const isOn = (key) => /^on[A-Z]/.test(key);
  // compat event callback and common property
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === null || nextVal === undefined) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}

function insert(child, parent, anchor) {
  // insertBefore 第二个参数为空时, 默认加在最后, 和append一致
  parent.insertBefore(child, anchor || null)
}

function remove(child) {
  const parent = child.parentNode;
  parent.removeChild(child);
}

function setElementText(el, text) {
  el.textContent = text;
}

export const renderer = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});

export function createApp(...args: [any]) { return renderer.createApp(...args); }
export * from '../runtime-core';
