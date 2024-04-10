import { Nodetypes } from '../ast';
import { baseParse } from '../parse';
import { transform } from '../transform';

describe('transform', () => {
  it('happy path', () => {
    const ast = baseParse('<div>hi,{{message}}</div>');
    const plugin = (node) => {
      if (node.type === Nodetypes.TEXT) {
        node.content = node.content + ' yui-vue3';
      }
    };
    // 如果参考其他的生成ast的库, 函数应该叫traversal更为合适
    transform(ast, {
      nodeTransforms: [plugin],
    });

    const nodeText = ast.children[0].children[0];
    expect(nodeText.content).toBe('hi, yui-vue3');
  });
});
