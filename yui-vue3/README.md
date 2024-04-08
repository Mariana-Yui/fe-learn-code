# 笔记
```typescript
// 直接执行函数用于断言myFunction的返回值
expect(myFunction()).toBe/toEqual()

// 传入匿名函数用于断言是否排除异常
expect(() => { myFunction() }).not.toThrow()
```