/**
 * vue3中使用的diff算法
 * 借鉴纯文本Diff算法的思路
 * 先对比开头相等的, 再对比结尾相等的, 缩小对比范围, 最后对比中间的
 */
function fastDiff(n1, n2, container) {
  const newChildren = n2.children;
  const oldChildren = n1.children;
  // 头指针
  let j = 0;
  let oldVNode = oldChildren[j];
  let newVNode = newChildren[j];
  // 处理相同的头节点
  while (oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode, container);
    j++;
    oldVNode = oldChildren[j];
    newVNode = newChildren[j];
  }

  // 尾指针
  let oldEnd = oldChildren.length - 1;
  let newEnd = newChildren.length - 1;

  oldVNode = oldChildren[oldEnd];
  newVNode = newChildren[newEnd];
  // 处理相同的尾节点
  while (oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode, container);

    oldVNode = oldChildren[--oldEnd];
    newVNode = newChildren[--newEnd];
  }

  // 处理完相同的头尾节点
  // 处理新节点列表 或 旧节点列表 指针已经遍历完的场景
  // 旧列表已经遍历完 新增节点
  if (j > oldEnd && j <= newEnd) {
    // 插入到新尾节点后一个节点之前
    const anchorIndex = newEnd + 1;
    const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null;
    while (j <= newEnd) {
      patch(null, newChildren[j++], container, anchor);
    }
  }
  // 新列表已经遍历完 移除旧节点
  else if (j > newEnd && j <= oldEnd) {
    while (j <= oldEnd) {
      unmount(oldChildren[j++]);
    }
  } else {
    /**
     * 更多的情况是处理完相同的头尾节点后新列表和旧列表都有剩余
     * 这就涉及查找+移动
     */
    // 待处理的剩余新列表长度
    const toBePatched = newEnd - j + 1;
    // 定义新节点->旧节点索引映射表(这里用array提升性能)
    const newIdxToOldIdxMap = new Array(toBePatched);
    newIdxToOldIdxMap.fill(-1);

    let oldStart = j;
    let newStart = j;
    let moved = false;
    // 和Simple-Diff类似, pos相当于lastIndex
    let pos = 0;
    // 构建新节点索引表
    /**
     * 作用是提升性能
     * 使用索引表就不需要在遍历旧列表中再for遍历一遍新列表
     * 时间复杂度: O(n^2) -> O(n)
     */
    const keyIndex = new Map();
    for (let i = newStart; i <= newEnd; i++) {
      keyIndex.set(newChildren[i].key, i);
    }
    // 记录已经处理(patch)过的新节点
    let patched = 0;
    /**
     * 因为是遍历旧节点列表, 所以遍历完后, 没用到的节点都被移除
     * 剩下的就是利用 newIdxToOldIdxMap 移动相同节点
     */
    for (let i = oldStart; i <= oldEnd; i++) {
      const oldVNode = oldChildren[i];
      if (patched < toBePatched) {
        // 通过索引表快速找到新的相同节点 key值的索引
        const k = keyIndex.get(oldVNode.key);
        if (typeof k !== 'undefined') {
          // 先patch 相同节点的children
          patch(oldVNode, newVNode, container);
          // 这里需要注意的是: 新节点索引是基于source的, 旧节点索引是基于oldChildren
          newIdxToOldIdxMap[k - newStart] = i;
          // 发现新节点不再是和遍历顺序一样的递增子序列
          if (k < pos) {
            moved = true;
          } else {
            pos = k;
          }
        } else {
          // 新节点中没找着 直接移除
          unmount(oldVNode);
        }
      } else {
        // 需要处理的新节点都处理完, 还剩旧节点直接移除
        unmount(oldVNode);
      }
    }

    /**
     * 逻辑执行到这里就只剩节点的移动和新增, 移除已经处理完
     * 节点的移动利用Simple-Diff的思想, 如果两个节点在新旧列表的相对顺序没有发生改变就不需要移动
     * newIdxToOldIdxMap 记录 newIndex -> oldIndex
     * 求newIdxToOldIdxMap数组的最长递增子序列的索引 = 新列表的最长递增子序列
     * 然后 通过两个指针 s指向最长递增子序列的尾部, i指向新节点列表的尾部 倒序遍历
     */
    if (moved) {
      const seq = getSequence(newIdxToOldIdxMap);

      // 尾指针 指向 最长递增子序列
      let s = seq.length - 1;
      // 尾指针 指向 新节点列表尾部
      let i = toBePatched - 1;
      for (i; i >= 0; i--) {
        // 初始化为-1 如果为-1说明不存在 新增节点
        if (newIdxToOldIdxMap[i] === -1) {
          const pos = i + newStart;
          const newVNode = newChildren[pos];
          const nextPos = pos + 1;
          // 在下一个节点的真实DOM节点前插入
          const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null;
          patch(null, newVNode, container, anchor);
        }
        // seq[s]新列表最长递增子序列索引 != 当前新列表索引i 移动节点
        else if (seq[s] !== i) {
          const pos = i + newStart;
          const newVNode = newChildren[pos];
          const nextPos = pos + 1;
          const anchor = nextPos < newChildren.len ? newChildren[nextPos].el : null;
          /**
           * 对于DOM中已挂载的节点而言
           * insertBefore/appendChild/removeChild 都是移动操作
           */
          insert(newVNode.el, container, anchor);
        }
        // 当前i = seq[s]最长递增子序列索引 不用移动 移动指针
        else {
          s--;
        }
      }
    }
  }
}

function patch(oldVNode: any, newVNode: any, container: any, anchor?: any) {
  throw new Error('Function not implemented.');
}

function unmount(arg0: any) {
  throw new Error('Function not implemented.');
}

// LIS 求最长递增子序列 这里是求序列的索引
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

function insert(el: any, container: any, anchor: any) {
  throw new Error('Function not implemented.');
}
