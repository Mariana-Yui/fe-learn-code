import { Nodetypes } from "./ast"

/**
 * ancestor 辅助栈 用于判断开始标签和闭合标签是否对应 
 */
export function baseParse(content: string) {
  // 创建上下文对象, 用于推进content
  const context = createContext(content)
  // 给children外包一层Root
  return createRoot(parseChildren(context, []))
}

function parseChildren(context: { source: string }, ancestor?: never[]): any {
  const nodes = [] as any[]

  // while
}


function createContext(content: string) {
  return {
    source: content
  }
}

function createRoot(children: any) {
  return {
    type: Nodetypes.ROOT,
    children
  }
}

