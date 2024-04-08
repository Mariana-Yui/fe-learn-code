import { Nodetypes } from "../ast"

describe('Parse',() => {
  // 变量插值
  describe('interpolation', () => {
    test('simple interpolation', () => {
      const ast = baseParse('{{ message }}')

      expect(ast.children[0]).toStrictEqual({
        type: Nodetypes.INTERPOLATION,
        content: {
          type: Nodetypes.SIMPLE_INTERPOLATION,
          content: 'message'
        }
      })
    })
  })

  describe('element', () => {
    it('simple element div', () => {
      const ast = baseParse('<div></div>')
    })
  })
})