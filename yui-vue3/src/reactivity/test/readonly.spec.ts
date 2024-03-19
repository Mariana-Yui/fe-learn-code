import { isReadonly, readonly } from '../reactive';

describe('readonly unit test', () => {
  it('check is readonly', () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const obj = readonly(original);
    expect(obj).not.toBe(original);
    expect(isReadonly(obj)).toBe(true);
    expect(isReadonly(original)).toBe(false);
    expect(isReadonly(obj.bar)).toBe(true);
    expect(isReadonly(original.bar)).toBe(false);
    expect(obj.foo).toBe(1);
  });

  it('call warn while set', () => {
    console.warn = jest.fn();
    const obj = readonly({ foo: 1 });
    obj.foo = 2;
    expect(console.warn).toHaveBeenCalled();
  });
});
