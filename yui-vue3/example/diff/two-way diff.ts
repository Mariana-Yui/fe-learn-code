function twoWayDiff(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2.children
  // 四个指针指向新旧节点列表的头尾节点
  let newStartIdx = 0
  let newEndIdx = newChildren.length - 1
  let oldStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  // 新旧的初始头尾节点
  let newStartVNode = newChildren[newStartIdx]
  let newEndVNode = newChildren[newEndIdx]
  let oldStartVNode = oldChildren[oldStartIdx]
  let oldEndVNode = oldChildren[oldEndIdx]

  
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    /**
     * if/else if的顺序是有讲究的
     * 头尾比较的四种情况都没匹配上走的第五种分支导致的旧节点undefined放在开始
     * 然后是头头/尾尾比较, 因为命中这种情况只会进行patch, 没有移动操作
     * 然后是头尾/尾头, 命中这种情况需要移动操作
     * 然后就是找旧列表的中间节点命中新头节点的, 命中进行移动, 没命中说明是新增节点
     */
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIdx]
    } else if (oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIdx]
    }
  }
}