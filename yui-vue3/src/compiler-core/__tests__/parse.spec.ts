import { Nodetypes } from '../ast';
import { baseParse } from '../parse';

/**
 * 生成的ast第一级是Root节点
 * 真正有意义的数据从ast.children[0]开始
 */
describe('Parse', () => {
  // 变量插值
  describe('interpolation', () => {
    test('simple interpolation', () => {
      const ast = baseParse('{{ message }}');

      expect(ast.children[0]).toStrictEqual({
        type: Nodetypes.INTERPOLATION,
        content: {
          type: Nodetypes.SIMPLE_INTERPOLATION,
          content: 'message',
        },
      });
    });
  });

  describe('element', () => {
    it('simple element div', () => {
      const ast = baseParse('<div></div>');
      expect(ast.children[0]).toStrictEqual({
        type: Nodetypes.ELEMENT,
        tag: 'div',
        children: [],
      });
    });
  });

  describe('text', () => {
    it('simple text', () => {
      const ast = baseParse('some text');
      expect(ast.children[0]).toStrictEqual({
        type: Nodetypes.TEXT,
        content: 'some text',
      });
    });
  });

  test('hello world', () => {
    const ast = baseParse('<div>hi,{{message}}</div>');
    expect(ast.children[0]).toStrictEqual({
      type: Nodetypes.ELEMENT,
      tag: 'div',
      children: [
        {
          type: Nodetypes.TEXT,
          content: 'hi,',
        },
        {
          type: Nodetypes.INTERPOLATION,
          content: {
            type: Nodetypes.SIMPLE_INTERPOLATION,
            content: 'message',
          },
        },
      ],
    });
  });

  // 标签嵌套
  test('Nested element', () => {
    const ast = baseParse('<div><p>hi</p>{{message}}</div>');
    expect(ast.children[0]).toStrictEqual({
      type: Nodetypes.ELEMENT,
      tag: 'div',
      children: [
        {
          type: Nodetypes.ELEMENT,
          tag: 'p',
          children: [
            {
              type: Nodetypes.TEXT,
              content: 'hi',
            },
          ],
        },
        {
          type: Nodetypes.INTERPOLATION,
          content: {
            type: Nodetypes.SIMPLE_INTERPOLATION,
            content: 'message',
          },
        },
      ],
    });
  });

  test('should throw error while lacking end tag', () => {
    expect(() => {
      baseParse('<div><span></div>');
    }).toThrow('缺少结束标签:span');
  });
});
