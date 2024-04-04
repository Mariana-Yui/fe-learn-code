import { h, ref } from '../../lib/yui-mini-vue3.esm.js';

/**
 * 1. 左侧的对比
 * (a b) c
 * (a b) d e
 */
// const prevChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'C'}, 'C'),
// ]
// const nextChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'D'}, 'D'),
//   h('p', {key: 'E'}, 'E'),
// ]

/**
 * 2. 右侧的对比
 * a (b c)
 * d e (b c)
 */
// const prevChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'C'}, 'C'),
// ]
// const nextChildren = [
//   h('p', {key: 'D'}, 'D'),
//   h('p', {key: 'E'}, 'E'),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'C'}, 'C'),
// ]

/**
 * 3. 新的比老的长 左侧
 * (a b)
 * (a b) c
 */
// const prevChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
// ]
// const nextChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'C'}, 'C'),
//   h('p', {key: 'D'}, 'D'),
// ]

/**
 * 3. 新的比老的长 右侧
 * (a b)
 * c (a b)
 */
// const prevChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
// ]
// const nextChildren = [
//   h('p', {key: 'D'}, 'D'),
//   h('p', {key: 'C'}, 'C'),
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
// ]

/**
 * 4. 老的比新的长 左侧
 * (a b) c
 * (a b)
 */
// const prevChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'C'}, 'C'),
// ]
// const nextChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
// ]

/**
 * 4. 老的比新的长 右侧
 * a (b c)
 * (b c)
 */
// const prevChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'C'}, 'C'),
// ]
// const nextChildren = [
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'C'}, 'C'),
// ]

/**
 * 5.1 对比中间部分
 * 删除老的 (老的存在, 新的不存在)
 * a,b,(c,d),f,g
 * a,b,(e,c),f,g
 * D 节点在新的里面没有 - 需要删除
 * C 节点 props 也发生了变化
 */
// const prevChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'C', id: 'c-prev'}, 'C'),
//   h('p', {key: 'D'}, 'D'),
//   h('p', {key: 'F'}, 'F'),
//   h('p', {key: 'G'}, 'G'),
// ]
// const nextChildren = [
//   h('p', {key: 'A'}, 'A'),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'E'}, 'E'),
//   h('p', {key: 'C', id: 'c-next'}, 'C'),
//   h('p', {key: 'F'}, 'F'),
//   h('p', {key: 'G'}, 'G'),
// ]

/**
 * 5.1.1
 * a,b,(c,e,d),f,g
 * a,b,(e,c),f,g
 * 中间部分, 除去相同的, 老的还比新的多可以直接删除
 */
const prevChildren = [
  h('p', {key: 'A'}, 'A'),
  h('p', {key: 'B'}, 'B'),
  h('p', {key: 'C', id: 'c-prev'}, 'C'),
  h('p', {key: 'E'}, 'E'),
  h('p', {key: 'D'}, 'D'),
  h('p', {key: 'F'}, 'F'),
  h('p', {key: 'G'}, 'G'),
]
const nextChildren = [
  h('p', {key: 'A'}, 'A'),
  h('p', {key: 'B'}, 'B'),
  h('p', {key: 'E'}, 'E'),
  h('p', {key: 'C', id: 'c-next'}, 'C'),
  h('p', {key: 'F'}, 'F'),
  h('p', {key: 'G'}, 'G'),
]

export default {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },

  render() {
    return this.isChange === true ? h('div', {}, nextChildren) : h('div', {}, prevChildren);
  },
};
