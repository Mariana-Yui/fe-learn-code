import { proxyRefs } from '../reactivity';
import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { publicInstanceProxyHandlers } from './componentPublicInstance';
import { initSlots } from './componentSlots';

export function createComponentInstance(vnode, parent) {
  const component: any = {
    type: vnode.type,
    vnode,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {}, // 根组件赋值{}, 孩子组件初始化都用祖先provides
    parent, // 提供给inject
    subTree: {},
    isMounted: false,
    emit: () => {},
  };

  component.emit = emit.bind(null, component);

  return component;
}

export function setupComponent(instance) {
  // TODO:
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const Component = instance.type;

  // 整合setupState, $el,$data,slots等数据, 代理对象
  // 为什么target是{_: instance} ? 为了能够在proxy handler中获取到instance
  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers());

  const { setup } = Component;

  if (setup) {
    setCurretnInstance(instance);
    // setup result can be function or object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurretnInstance(null);

    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  // TODO: function

  if (typeof setupResult === 'object') {
    /**
     * proxyRefs: 在render()访问this.xx -> xx.value
     */
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

export function getCurrentInstance() {
  return currentInstance;
}

function setCurretnInstance(instance) {
  currentInstance = instance;
}
