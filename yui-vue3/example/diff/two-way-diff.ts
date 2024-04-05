function twoWayDiff(n1, n2, container) {
  const oldChildren = n1.children;
  const newChildren = n2.children;
  // 四个指针指向新旧节点列表的头尾节点
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;
  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  // 新旧的初始头尾节点
  let newStartVNode = newChildren[newStartIdx];
  let newEndVNode = newChildren[newEndIdx];
  let oldStartVNode = oldChildren[oldStartIdx];
  let oldEndVNode = oldChildren[oldEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    /**
     * if/else if的顺序是有讲究的
     * 头尾比较的四种情况都没匹配上走的第五种分支导致的旧节点undefined放在开始
     * 然后是头头/尾尾比较, 因为命中这种情况只会进行patch, 没有移动操作
     * 然后是头尾/尾头, 命中这种情况需要移动操作
     * 然后就是找旧列表的中间节点命中新头节点的, 命中进行移动, 没命中说明是新增节点
     */
    if (!oldStartVNode) {
      // 旧节点 undefined
      oldStartVNode = oldChildren[++oldStartIdx];
    } else if (oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIdx];
    } else if (oldStartVNode.key === newStartVNode.key) {
      // 旧头节点 - 新头节点
      patch(oldStartVNode, newStartVNode, container);
      oldStartVNode = oldChildren[++oldStartIdx];
      newStartVNode = newChildren[++newStartIdx];
    } else if (oldEndVNode.key === newEndVNode.key) {
      // 旧尾节点 - 新尾节点
      patch(oldEndVNode, newEndVNode, container);
      oldEndVNode = oldChildren[--oldEndIdx];
      newEndVNode = newChildren[--newEndIdx];
    } else if (oldStartVNode.key === newEndVNode.key) {
      // 旧头节点 - 新尾节点
      patch(oldEndVNode, newEndVNode, container);
      // 将旧头节点 移动到 旧尾节点的后面
      insert(oldStartVNode.el, container, oldEndVNode.el.nextsibling);
      oldStartVNode = oldChildren[++oldStartIdx];
      newEndVNode = newChildren[--newEndIdx];
    } else if (oldEndVNode.key === newStartVNode.key) {
      // 旧尾节点 - 新头节点
      patch(oldEndVNode, newStartVNode, container);
      // 将旧尾节点 移动到 旧头节点的前面
      insert(oldEndVNode.el, container, oldStartVNode.el);
      oldEndVNode = oldChildren[--oldEndIdx];
      newStartVNode = newChildren[++newStartIdx];
    } else {
      /**
       * 四种情况都没命中, 匹配旧列表的中间节点
       * 同时算法规定此时用于匹配的是新头节点
       */
      const idxInOld = oldChildren.findIndex((node) => node.key === newStartVNode.key);

      if (idxInOld > 0) {
        const vNodeToMove = oldChildren[idxInOld];
        patch(vNodeToMove, newStartVNode, container);
        insert(vNodeToMove.el, container, oldStartVNode.el);
        oldChildren[idxInOld] = undefined;
      } else {
        // 没找到, 说明是新增节点, 在旧头节点对应的DOM节点之前插入
        patch(null, newStartVNode, container, oldStartVNode.el);
      }
      // 处理完 新头节点索引后移
      newStartVNode = newChildren[++newStartIdx];
    }
  }

  // 都处理完了仍然后存在有新增节点或者有旧节点需要移除的场景
  if (oldEndIdx < oldStartIdx && newEndIdx >= newStartIdx) {
    // 新节点列表的尾指针索引还没超过头指针, 新增节点
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      patch(null, newChildren[i], container, oldStartVNode.el);
    }
  } else if (oldEndIdx >= oldStartIdx && newEndIdx < newStartIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      unmount(oldChildren[i]);
    }
  }
}

function patch(n1: any, n2: any, container: any, anchor?: any) {
  throw new Error('Function not implemented.');
}

function insert(el: any, container: any, anchor: any) {
  throw new Error('Function not implemented.');
}
function unmount(el: any) {
  throw new Error('Function not implemented.');
}
