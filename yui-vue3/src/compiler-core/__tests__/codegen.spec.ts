import { baseParse } from '../parse';
import { transform } from '../transform';
import { generate } from '../codegen';

describe('codegen', () => {
  it.only('string', () => {
    const ast = baseParse('hi');
    transform(ast);
    const { code } = generate(ast);

    /**
     * 快照
     * 1. debug
     * 2. 有意为之
     */
    expect(code).toMatchSnapshot();
  });
});
