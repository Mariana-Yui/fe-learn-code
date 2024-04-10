/**
 * https://template-explorer.vuejs.org
 * Vue官方提供的网站直观查看template语法 -> render函数
 */

interface Context {
  code: string;
  push: (source: string) => void;
}

export function generate(ast) {
  const context = createCodegenContext();
  const { push } = context;

  const functionName = 'render';
  // render() 函数参数
  const args = ['_ctx', '_cache'];
  const signature = args.join(', ');

  // 我来组成头部
  push(`function ${functionName}(${signature}) {`);
  push('return ');

  // 我来组成身体
  genNode(ast.codegenNode, context);
  // 我来组成尾部
  push('}');

  return {
    code: context.code,
  };
}

function createCodegenContext(): Context {
  const context = {
    code: '',
    // push 不断将ast node解析完的string 添加到 context.code
    push(source) {
      context.code += source;
    },
  };

  return context;
}

function genNode(node: any, context: Context) {
  const { push } = context;
  push(`'${node.content}'`);
}
