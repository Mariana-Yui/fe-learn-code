/**
 * 简易Diff(Simple Diff)利用lastIndex来判断旧节点索引是否在lastIndex之前
 * 从而决定旧节点是否需要移动, 这样的思想决定了移动一定是将前面的节点移动到后面
 * 而对于相对顺序没有发生改变的节点不做移动
 * 新   旧
 * P3   P1
 * P1   P2
 * P2   P3
 * 上述例子 使用Simple Diff需要移动两次(P1, P2)
 * 但更简单的方式是直接移动P3, 所以Vue2实现了双端Diff(Two-Way Diff)
 */
function simpleDiff(n1, n2, container) {
  const oldChildren = n1.children;
  const newChildren = n2.children;

  // 存储寻找过程中旧列表的最大索引值, 初始化为0就相当于规定了新节点列表的第一个元素不需要移动
  let lastIndex = 0;
  // 先遍历新的节点列表, 然后遍历旧的, 去旧的里面是否可复用的节点
  for (let i = 0; i < newChildren.length; i++) {
    const newVNode = newChildren[i];

    // 旧的中是否找到
    let find = false;
    for (let j = 0; j < oldChildren.length; j++) {
      const oldVNode = oldChildren[j];
      if (oldVNode.key === newVNode.key) {
        // 找到了
        find = true;
        // key相等也不一定完全一致, 继续往下对比children
        patch(oldVNode, newVNode, container);
        // 对比完新旧两个节点已经完全一致, 判断是否需要移动
        if (j < lastIndex) {
          /**
           * 新节点列表遍历顺序是从前往后的, 后遍历的节点B在前遍历节点A的后面
           * 如果发现j < lastIndex, 说明在旧节点列表中, B在A前面
           * 说明需要移动B
           */
          const prevVNode = newChildren[i - 1];
          if (prevVNode) {
            /**
             * 需要将newVNode移动到prevVNode的真实DOM节点的后面
             * 但是由于使用的insertBefore, 所以需要找到prevVNode真实DOM节点的后一个节点
             */
            const anchor = prevVNode.el.nextSibling;
            insert(newVNode, container, anchor);
          }
        } else {
          // j >= lastIndex 说明A和B在新旧列表中都是递增的关系, 更新lastIndex
          lastIndex = j;
        }
        break;
      }
    }

    // 没找到, 新增节点
    if (!find) {
      const prevVNode = newChildren[i - 1];
      let anchor = null;
      if (prevVNode) {
        anchor = prevVNode.el.nextSibling;
      } else {
        anchor = container.firstChild;
      }

      insert(newVNode, container, anchor);
    }

    // 更新和新增都结束后, 遍历旧列表删除不再使用的节点
    for (let i = 0; i < oldChildren.length; i++) {
      const oldVNode = oldChildren[i];
      // key相当于"ID Card" 没找到说明旧节点不再使用
      const has = newChildren.find((vnode) => vnode.key === oldVNode.key);

      if (!has) {
        unmount(oldVNode.el);
      }
    }
  }
}

function patch(oldVNode: any, newVNode: any, container: any) {
  throw new Error('Function not implemented.');
}

function insert(newVNode: any, container: any, anchor: any) {
  throw new Error('Function not implemented.');
}

function unmount(el: any) {
  throw new Error('Function not implemented.');
}
