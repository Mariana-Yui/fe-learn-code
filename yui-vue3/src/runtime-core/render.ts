import { effect } from '../reactivity/effect';
import { EMPTY_OBJ } from '../shared';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';
import { Fragment, Text } from './vnode';

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;
  function render(vnode, container) {
    patch(null, vnode, container, null, null);
  }

  function patch(n1, n2, container, parentComponent, anchor) {
    const { type } = n2;
    switch (type) {
      // 对于slots而言, 虚拟节点并不希望外层包一层无谓的节点
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
    const { children } = n2; // 该链路children已经明确是字符串
    const text = (n2.el = document.createTextNode(children));
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
    const el: Element = (vnode.el = hostCreateElement(vnode.type));
    // children
    const { children, props } = vnode;
    // children string
    if (ShapeFlags.TEXT_CHILDREN & vnode.shapeFlag) {
      el.textContent = children;
    } else if (ShapeFlags.ARRAY_CHILDREN & vnode.shapeFlag) {
      mountChild(vnode.children, el, parentComponent, anchor);
    }

    // props
    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
    }

    hostInsert(el, container, anchor);
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log('patchElement');
    console.log('n1:', n1);
    console.log('n2:', n2);

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    /**
     * 初始化时n1.el是递归之后自底向上赋值的
     * 而更新节点n2.el此时刚开始, 还没赋值, 所以n2.el还是undefined
     */
    const el = (n2.el = n1.el);
    /**
     * important 要明确el, container的含义
     * el: vnode对应的DOM节点
     * container: vnode对应的父DOM节点
     */
    // 处理children
    patchChildren(n1, n2, el, parentComponent, anchor);
    // 处理props
    patchProps(el, oldProps, newProps);
  }

  /**
   * 更新children的四种场景
   * 1. array -> text
   * 2. text -> text
   * 3. text -> array
   * 4. array -> array
   */
  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const prevShapeFlag = n1.shapeFlag;
    const c1 = n1.children;
    const { shapeFlag } = n2;
    const c2 = n2.children;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 清空老 children
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        // 2. 设置新 text
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '');
        mountChild(c2, container, parentComponent, anchor);
      } else {
        // array diff array
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
    // 1. 左侧相同 移动 i
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

    // 2. 右侧相同 移动 e 长度
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

    /**
     * 3. 新的 比 老的 长 (新增)
     * 会存在insert节点前的操作, 所以需要知道插入位置
     * 引入 anchor
     *  */
    if (i > e1) {
      if (i <= e2) {
        // 这里是e2+1, 不是i+1, 当存在多个节点需要insert时, i+1获取到的是null, 会变成append操作
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      /**
       * 4. 老的 比 新的 长 (删除)
       */
      while (i <= e1) {
        debugger;
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      /**
       * 5. 对比中间部分
       */
      let s1 = i;
      let s2 = i;
      const toBePatched = e2 - s2 + 1; // 新的需要对比的长度
      let patched = 0; // 相同key的 已经对比过的
      // 新->老的相同节点的下标映射, 用于求最长递增子序列
      const newIndexToOldIndexMap = new Array(toBePatched).fill(0);

      const keyToNewIndexMap = new Map();

      // 遍历新的, 将key加到map
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        keyToNewIndexMap.set(nextChild.key, i);
      }
      debugger;

      // 遍历老的, 找到新的中存在节点
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          // 如果相同的都对比过, 老的还有剩下, 直接删除
          hostRemove(prevChild.el);
          continue;
        }

        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (let j = s2; j <= e2; j++) {
            if (isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }

        // 没找到删除老节点, 找到继续patch节点内容
        if (newIndex === undefined) {
          hostRemove(prevChild.el);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1; // 初始化为0, 这里+1做区分
          patch(prevChild, c2[newIndex], container, parentComponent, null);
          patched++; // 新老相同节点对比过才++
        }
      }
    }
  }

  function unmountChildren(children) {
    for (const child of children) {
      const el = child.el;
      hostRemove(el);
    }
  }

  /**
   * 更新props的三种场景
   * 1. props值发生改变
   * 2. props值变成undefined
   * 3. props key不在了
   */
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
    /**
     * effect依赖收集, update前置工作
     */
    effect(() => {
      if (!instance.isMounted) {
        console.log('initialize');
        const { proxy } = instance;
        // instance.subTree记录更新前的subTree, update时和新生成的subTree diff
        const subTree = (instance.subTree = instance.render.call(proxy));

        // vnode -> patch
        // now vnode is element -> mountElement
        patch(null, subTree, container, instance, anchor); // instance 父实例

        // patch递归此时自底向上, el -> $el 有值
        vnode.el = subTree.el;

        instance.isMounted = true;
      } else {
        console.log('update');
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        // 同理
        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance, anchor);
      }
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
