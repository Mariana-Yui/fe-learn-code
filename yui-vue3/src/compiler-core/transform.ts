interface Context {
  root: any;
  nodeTransforms: any[];
}

// options传入的就是loader/plugin
export function transform(root, options = {}) {
  const context = createTransformContext(root, options);
  // 1. 遍历 - 深度优先遍历
  traversalNode(root, context);

  createRootCodeGen(root);
}

// ast第一层级是Root, generation阶段不需要, 所以这里新增codegeNode给generate用
function createRootCodeGen(root: any) {
  const child = root.children[0];
  root.codegenNode = child;
}

function createTransformContext(root: any, options: any): Context {
  const context = {
    root,
    // 定义的plugin列表
    nodeTransforms: options.nodeTransforms || [],
  };

  return context;
}

function traversalNode(node: any, context: Context) {
  const { nodeTransforms } = context;
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node);
  }

  // 递归遍历children
  traverseChildren(node, context);
}

function traverseChildren(node: any, context: Context) {
  const { children } = node;

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      traversalNode(node, context);
    }
  }
}
