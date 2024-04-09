import { Nodetypes } from './ast';

const enum TagType {
  Start,
  End,
}

interface Context {
  source: string;
}

/**
 * ancestor 辅助栈 用于判断开始标签和闭合标签是否对应
 */
export function baseParse(content: string) {
  // 创建上下文对象, 用于推进content
  const context = createContext(content);
  // 给children外包一层Root
  return createRoot(parseChildren(context, []));
}

function parseChildren(context: { source: string }, ancestor: any[]) {
  const nodes = [] as any[];

  /**
   * html肯定是以标签开始以标签结束
   * 所以这里通过判断是否遇到</结束标签
   */
  while (!isEnd(context, ancestor)) {
    let node;
    // 输入文本
    const s = context.source;
    // {{ message }} 处理插值
    if (s.startsWith('{{')) {
      node = parseInterpolation(context);
    } else if (s[0] === '<') {
      // <div> 处理标签, 因为可能存在嵌套标签, 所以传入ancestor
      if (/[a-z]/i.test(s[1])) {
        // 递归处理标签内容
        node = parseElement(context, ancestor);
      }
    }

    // 都不满足则认为是文本
    if (!node) {
      node = parseText(context);
    }

    nodes.push(node);
  }
  return nodes;
}

function createContext(content: string) {
  return {
    source: content,
  };
}

function createRoot(children: any) {
  return {
    type: Nodetypes.ROOT,
    children,
  };
}

function isEnd(context: Context, ancestor: any[]) {
  const s = context.source;
  // 1.当遇到匹配的结束标签时
  if (s.startsWith('</')) {
    // 遍历ancestor栈查找是否有对应的开始标签
    for (let i = ancestor.length - 1; i >= 0; i--) {
      const tag = ancestor[i].tag;
      if (startsWithEndTagOpen(s, tag)) {
        return true;
      }
    }
  }
  // 2.当source有值时
  return !s;
}

function startsWithEndTagOpen(source: string, tag: string) {
  return source.startsWith('</') && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase();
}

function parseInterpolation(context: Context) {
  const openDelimiter = '{{';
  const closeDelimiter = '}}';

  // indexOf第二个参数指定fromIndex 对于只出现一次的元素是否设置都不影响结果
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);
  // 向前推进
  advanceBy(context, openDelimiter.length);

  const rawContentLength = closeIndex - openDelimiter.length;
  // 推进 插值
  const rawContent = parseTextData(context, rawContentLength);
  // 去除空格
  const content = rawContent.trim();

  advanceBy(context, closeDelimiter.length);

  return {
    type: Nodetypes.INTERPOLATION,
    content: {
      type: Nodetypes.SIMPLE_INTERPOLATION,
      content,
    },
  };
}

// parse过程是从头开始不断向后推进的过程, 解析完类型后就推进文本
function advanceBy(context: Context, length: number) {
  context.source = context.source.slice(length);
}

function parseTextData(context: Context, length: number) {
  const content = context.source.slice(0, length);
  advanceBy(context, length);
  return content;
}

function parseElement(context: Context, ancestor: any[]) {
  // 解析标签
  const element: any = parseTag(context, TagType.Start);
  // 入栈
  ancestor.push(element);
  // 嵌套标签 递归处理
  element.children = parseChildren(context, ancestor);
  // 回溯
  ancestor.pop();

  // 匹配到结束标签继续推进 否则抛出异常 非法的html结构
  if (startsWithEndTagOpen(context.source, element)) {
    parseTag(context, TagType.End);
  } else {
    throw new Error(`缺少标签:${element.tag}`);
  }
}

function parseTag(context: Context, type: TagType) {
  const match = /^<\/?([a-z]*)/i.exec(context.source)!;
  console.log('match:', match);
  const tag = match[1];
  // 推进 <div or </div
  advanceBy(context, match[0].length);
  // 推进 >
  advanceBy(context, 1);

  if (type === TagType.End) return;

  return {
    type: Nodetypes.ELEMENT,
    tag,
  };
}

function parseText(context: Context) {
  let endIndex = context.source.length;
  // 没遇到{{和<时都认为是纯文案
  const endTokens = ['<', '{{'];

  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i]);
    // 更新为最近的下标
    if (index !== -1 && index < endIndex) {
      endIndex = index;
    }
  }

  // 推进
  const content = parseTextData(context, endIndex);
  console.log('content ==========', content);

  return {
    type: Nodetypes.TEXT,
    content,
  };
}
