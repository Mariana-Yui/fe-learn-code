var ShapeFlags = /* @__PURE__ */ ((ShapeFlags2) => {
  ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
  ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
  ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
  ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
  ShapeFlags2[ShapeFlags2["SLOT_CHILDREN"] = 16] = "SLOT_CHILDREN";
  return ShapeFlags2;
})(ShapeFlags || {});

const Fragment = Symbol("Fragment");
const Text = Symbol("Text");
function createVNode(type, props, children) {
  const vnode = {
    type,
    props,
    children,
    key: props && props.key,
    el: null,
    // this.$el
    shapeFlag: getShapeFlag(type)
  };
  if (typeof vnode.children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(vnode.children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof vnode.children === "object") {
      vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.SLOT_CHILDREN;
    }
  }
  return vnode;
}
function createTextVNode(text) {
  return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}

function h(type, props, children) {
  return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
  const slot = slots[name];
  if (slot) {
    if (typeof slot === "function") {
      return createVNode(Fragment, {}, slot(props));
    }
  }
}

const extend = Object.assign;
const EMPTY_OBJ = {};
const isObject = (val) => {
  return val !== null && typeof val === "object";
};
const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal);
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const camelize = (str) => {
  return str.replace(/-(\w)/g, (_, c) => {
    return c ? c.toUpperCase() : "";
  });
};
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
const toHandlerKey = (str) => {
  return str ? "on" + capitalize(str) : "";
};

let activeEffect;
let shouldTrack;
const targetMap = /* @__PURE__ */ new Map();
class ReactiveEffect {
  constructor(fn, scheduler) {
    this.scheduler = scheduler;
    this.deps = [];
    this.active = true;
    this.fn = fn;
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const result = this.fn();
    shouldTrack = false;
    return result;
  }
  stop() {
    if (this.active) {
      cleanEffect(this);
      this.onStop?.();
      this.active = false;
    }
  }
}
function cleanEffect(effect2) {
  effect2.deps.forEach((dep) => {
    dep.delete(effect2);
  });
  effect2.deps.length = 0;
}
function track(target, key) {
  if (!isTracking())
    return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = /* @__PURE__ */ new Map();
    targetMap.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = /* @__PURE__ */ new Set();
    depsMap.set(key, deps);
  }
  trackEffects(deps);
}
function trackEffects(deps) {
  if (deps.has(activeEffect))
    return;
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}
function isTracking() {
  return shouldTrack && activeEffect !== void 0;
}
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  triggerEffects(deps);
}
function triggerEffects(deps) {
  deps.forEach((effect2) => {
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  });
}
function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);
function createGetter(isReadonly = false, shallow = false) {
  return function get2(target, key) {
    const res = Reflect.get(target, key);
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    if (!isReadonly) {
      track(target, key);
    }
    if (!shallow && isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}
function createSetter() {
  return function set2(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}
const mutableHandlers = {
  get,
  set
};
extend({}, mutableHandlers, {
  get: shallowReactiveGet
});
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, val) {
    console.warn("readonly");
    return true;
  }
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});

var ReactiveFlags = /* @__PURE__ */ ((ReactiveFlags2) => {
  ReactiveFlags2["IS_REACTIVE"] = "__v_isReactive";
  ReactiveFlags2["IS_READONLY"] = "__v_isReadonly";
  return ReactiveFlags2;
})(ReactiveFlags || {});
function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers);
}
function createActiveObject(raw, baseHandler) {
  if (!isObject(raw)) {
    console.warn(`target ${raw} is not Object`);
  }
  return new Proxy(raw, baseHandler);
}

class RefImpl {
  constructor(value) {
    this.__v_isRef = true;
    this._rawValue = value;
    this._value = convert(value);
    this.deps = /* @__PURE__ */ new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerRefValue(this);
    }
  }
}
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}
function trackRefValue(ref2) {
  if (isTracking()) {
    trackEffects(ref2.deps);
  }
}
function triggerRefValue(ref2) {
  const deps = ref2.deps;
  deps && triggerEffects(deps);
}
function ref(value) {
  return new RefImpl(value);
}
function isRef(ref2) {
  return !!ref2.__v_isRef;
}
function unRef(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value;
      } else {
        return Reflect.set(target, key, value);
      }
    }
  });
}

function emit(instance, event, ...args) {
  console.log("emit:", event);
  const { props } = instance;
  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}

function initProps(instance, rawProps) {
  instance.props = rawProps || {};
}

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $props: (i) => i.props,
  $slots: (i) => i.slots
};
function publicInstanceProxyHandlers() {
  return {
    get({ _: instance }, key) {
      const { setupState } = instance;
      if (hasOwn(setupState, key)) {
        return setupState[key];
      } else if (hasOwn(instance.props, key)) {
        return instance.props[key];
      }
      const publicGetter = publicPropertiesMap[key];
      if (publicGetter) {
        return publicGetter(instance);
      }
    }
  };
}

function initSlots(instance, children) {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}
function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key];
    slots[key] = (props) => normalizeSlotValue(value(props));
  }
}
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode, parent) {
  const component = {
    type: vnode.type,
    vnode,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    // 根组件赋值{}, 孩子组件初始化都用祖先provides
    parent,
    // 提供给inject
    subTree: {},
    isMounted: false,
    emit: () => {
    }
  };
  component.emit = emit.bind(null, component);
  return component;
}
function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const Component = instance.type;
  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers());
  const { setup } = Component;
  if (setup) {
    setCurretnInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    });
    setCurretnInstance(null);
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
let currentInstance = null;
function getCurrentInstance() {
  return currentInstance;
}
function setCurretnInstance(instance) {
  currentInstance = instance;
}

function provide(key, value) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;
    if (key in parentProvides) {
      return parentProvides[key];
    } else if (defaultValue) {
      if (typeof defaultValue === "function") {
        return defaultValue();
      }
      return defaultValue;
    }
  }
}

function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer);
      }
    };
  };
}

function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options;
  function render(vnode, container) {
    patch(null, vnode, container, null, null);
  }
  function patch(n1, n2, container, parentComponent, anchor) {
    const { type } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (ShapeFlags.ELEMENT & n2.shapeFlag) {
          processElement(n1, n2, container, parentComponent, anchor);
        } else if (ShapeFlags.STATEFUL_COMPONENT & n2.shapeFlag) {
          processComponent(n1, n2, container, parentComponent, anchor);
        }
    }
  }
  function processFragment(n1, n2, container, parentComponent, anchor) {
    mountChild(n2.children, container, parentComponent, anchor);
  }
  function processText(n1, n2, container) {
    const { children } = n2;
    const text = n2.el = document.createTextNode(children);
    container.append(text);
  }
  function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor);
    } else {
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }
  function mountElement(vnode, container, parentComponent, anchor) {
    const el = vnode.el = hostCreateElement(vnode.type);
    const { children, props } = vnode;
    if (ShapeFlags.TEXT_CHILDREN & vnode.shapeFlag) {
      el.textContent = children;
    } else if (ShapeFlags.ARRAY_CHILDREN & vnode.shapeFlag) {
      mountChild(vnode.children, el, parentComponent, anchor);
    }
    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
    }
    hostInsert(el, container, anchor);
  }
  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log("patchElement");
    console.log("n1:", n1);
    console.log("n2:", n2);
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = n2.el = n1.el;
    patchChildren(n1, n2, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }
  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const prevShapeFlag = n1.shapeFlag;
    const c1 = n1.children;
    const { shapeFlag } = n2;
    const c2 = n2.children;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChild(c2, container, parentComponent, anchor);
      } else {
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }
  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }
    let i = 0;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      let s1 = i;
      let s2 = i;
      const toBePatched = e2 - s2 + 1;
      let patched = 0;
      const newIndexToOldIndexMap = new Array(toBePatched).fill(0);
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      let moved = false;
      let maxNewIndexSoFar = 0;
      for (let i2 = s2; i2 <= e2; i2++) {
        const nextChild = c2[i2];
        keyToNewIndexMap.set(nextChild.key, i2);
      }
      for (let i2 = s1; i2 <= e1; i2++) {
        const prevChild = c1[i2];
        if (patched >= toBePatched) {
          hostRemove(prevChild.el);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (let j2 = s2; j2 <= e2; j2++) {
            if (isSameVNodeType(prevChild, c2[j2])) {
              newIndex = j2;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          hostRemove(prevChild.el);
        } else {
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          newIndexToOldIndexMap[newIndex - s2] = i2 + 1;
          patch(prevChild, c2[newIndex], container, parentComponent, null);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
      let j = increasingNewIndexSequence.length - 1;
      for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
        const nextIndex = s2 + i2;
        const nextChildren = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;
        if (newIndexToOldIndexMap[i2] === 0) {
          patch(null, nextChildren, container, parentComponent, anchor);
        }
        if (moved) {
          if (j < 0 || i2 !== increasingNewIndexSequence[j]) {
            console.log("\u79FB\u52A8\u4F4D\u7F6E");
            hostInsert(nextChildren.el, container, anchor);
          } else {
            j--;
          }
        }
      }
    }
  }
  function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
  }
  function unmountChildren(children) {
    for (const child of children) {
      const el = child.el;
      hostRemove(el);
    }
  }
  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const newProp = newProps[key];
        if (prevProp !== newProp) {
          hostPatchProp(el, key, prevProp, newProp);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }
  function mountChild(children, container, parentComponent, anchor) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor);
    });
  }
  function processComponent(n1, n2, container, parentComponent, anchor) {
    mountComponent(n2, container, parentComponent, anchor);
  }
  function mountComponent(initialVNode, container, parentComponent, anchor) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container, anchor);
  }
  function setupRenderEffect(instance, vnode, container, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("initialize");
        const { proxy } = instance;
        const subTree = instance.subTree = instance.render.call(proxy);
        patch(null, subTree, container, instance, anchor);
        vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance, anchor);
      }
    });
  }
  return {
    createApp: createAppAPI(render)
  };
}

function createElement(type) {
  return document.createElement(type);
}
function patchProp(el, key, prevVal, nextVal) {
  const isOn = (key2) => /^on[A-Z]/.test(key2);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === null || nextVal === void 0) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}
function insert(child, parent, anchor) {
  parent.insertBefore(child, anchor || null);
}
function remove(child) {
  const parent = child.parentNode;
  parent.removeChild(child);
}
function setElementText(el, text) {
  el.textContent = text;
}
const renderer = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText
});
function createApp(...args) {
  return renderer.createApp(...args);
}

export { createApp, createRenderer, createTextVNode, createVNode, getCurrentInstance, h, inject, provide, proxyRefs, ref, renderSlots, renderer };
