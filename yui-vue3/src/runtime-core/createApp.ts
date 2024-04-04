import { createVNode } from './vnode';

// createAppAPI的作用: 闭包传入自定义渲染器, 默认就是runtime-dom
export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        const vnode = createVNode(rootComponent);

        render(vnode, rootContainer);
      },
    };
  };
}
