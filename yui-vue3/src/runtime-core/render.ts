import { effect } from '../reactivity/effect';
import { EMPTY_OBJ } from '../shared';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';
import { Fragment, Text } from './vnode';

/**
 * parentComponent: 创建实例时使用, 用于provide/inject特性
 * anchor: insert时使用, 作为insertBefore的锚点
 */

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

  // Vue.js设计与实现中的例子参见 example/diff/fast-diff.ts
  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    const l2 = c2.length;
    // 尾指针
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;

    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }

    // 头指针 统一指向索引0
    let i = 0;
    // 1. 头部相同的节点 移动头指针 只进行patch
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

    // 2. 尾部相同的节点 移动尾指针 只进行patch
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
     * 前两步预处理完, 如果如果有一方的尾节点已经越过头节点
     * 说明只剩下新增新节点 or 移除老节点 操作
     *  */
    if (i > e1) {
      if (i <= e2) {
        /** 新增 */
        // 这里是e2+1, 不是i+1, 当存在多个节点需要insert时, i+1获取到的是null, 会变成append操作
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      /** 删除 */
      while (i <= e1) {
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

      // 是否需要移动
      let moved = false;
      // 等同于Simple-Diff的lastIndex
      let maxNewIndexSoFar = 0;

      // 遍历新的, 将key加到map
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        keyToNewIndexMap.set(nextChild.key, i);
      }

      // 遍历老的, 找到新的中存在节点
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        // 新节点列表都处理完 旧节点还有剩下 直接移除 (1)
        if (patched >= toBePatched) {
          hostRemove(prevChild.el);
          continue;
        }

        let newIndex;
        /**
         * 兼容node.key可能不存在的场景
         * 存在key就从表里找, 不存在key遍历新列表去找
         */
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

        // 当前旧节点在新列表中找不到 直接移除 (2)
        if (newIndex === undefined) {
          hostRemove(prevChild.el);
        } else {
          // 相对顺序没有发生改变 更新lastIndex
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          /**
           * 初始化为0, 这里+1做区分, 后续如果发现是0则表示是新增节点
           * 这里用i+1只用作区分, 用i+2 i+3都可以
           * 因为这里的值只是用作求最长递增子序列, 最后要用的到的是newIndexToOldIndexMap的索引
           * 即新列表的最长递增子序列
           */
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          patch(prevChild, c2[newIndex], container, parentComponent, null);
          patched++; // 新老相同节点对比过才++
        }
      }

      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
      // 尾指针 指向lis
      let j = increasingNewIndexSequence.length - 1;

      // 尾指针 指向新列表(掐头去尾)
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChildren = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;

        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChildren, container, parentComponent, anchor);
        }

        if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            console.log('移动位置');
            hostInsert(nextChildren.el, container, anchor);
          } else {
            j--;
          }
        }
      }
    }
  }

  // 最长递增子序列 用于做新老节点列表的递增子序列映射
  function getSequence(arr: number[]): number[] {
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
          c = (u + v) >> 1;
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
