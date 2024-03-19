import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { publicInstanceProxyHandlers } from './componentPublicInstance';

export function createComponentInstance(vnode) {
  const component = {
    type: vnode.type,
    vnode,
    setupState: {},
    emit: () => {},
  };

  component.emit = emit.bind(null, component);

  return component;
}

export function setupComponent(instance) {
  // TODO:
  initProps(instance, instance.vnode.props);
  // initSlots()

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const Component = instance.type;

  // 整合setupState, $el,$data,$slots等数据, 代理对象
  // 为什么target是{_: instance} ? 为了能够在proxy handler中获取到instance
  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers());

  const { setup } = Component;

  if (setup) {
    // setup result can be function or object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });

    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  // TODO: function

  if (typeof setupResult === 'object') {
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
