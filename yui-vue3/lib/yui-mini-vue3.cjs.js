'use strict';

var ShapeFlags = /* @__PURE__ */ ((ShapeFlags2) => {
  ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
  ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
  ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
  ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
  return ShapeFlags2;
})(ShapeFlags || {});

const extend = Object.assign;
const isObject = (val) => {
  return val !== null && typeof val === "object";
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

const targetMap = /* @__PURE__ */ new Map();
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

function emit(instance, event, ...args) {
  console.log("emit:", event);
  const { props } = instance;
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
  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}

function initProps(instance, rawProps) {
  instance.props = rawProps || {};
}

const publicPropertiesMap = {
  $el: (i) => i.vnode.el
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

function createComponentInstance(vnode) {
  const component = {
    type: vnode.type,
    vnode,
    setupState: {},
    emit: () => {
    }
  };
  component.emit = emit.bind(null, component);
  return component;
}
function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const Component = instance.type;
  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers());
  const { setup } = Component;
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    });
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}

function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
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
  const el = initialVnode.el = document.createElement(initialVnode.type);
  const { children, props } = initialVnode;
  if (ShapeFlags.TEXT_CHILDREN & initialVnode.shapeFlag) {
    el.textContent = children;
  } else if (ShapeFlags.ARRAY_CHILDREN & initialVnode.shapeFlag) {
    mountChild(initialVnode, el);
  }
  const isOn = (key) => /^on[A-Z]/.test(key);
  for (const key in props) {
    const val = props[key];
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
  patch(subTree, container);
  vnode.el = subTree.el;
}

function createVNode(type, props, children) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    // this.$el
    shapeFlag: getShapeFlag(type)
  };
  if (typeof vnode.children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(vnode.children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }
  return vnode;
}
function getShapeFlag(type) {
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}

function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const vnode = createVNode(rootComponent);
      render(vnode, rootContainer);
    }
  };
}

function h(type, props, children) {
  return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
