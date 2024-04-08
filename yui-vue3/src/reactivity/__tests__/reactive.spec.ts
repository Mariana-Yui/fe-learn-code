import { isReactive, reactive, shallowReactive } from '../reactive';

describe('reactive unit test', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(observed.foo).toBe(1);
  });

  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });

  it('should not make non-reactive properties reactive', () => {
    const observed = shallowReactive({ foo: 1, bar: { baz: 2 } });
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(observed.bar)).toBe(false);
  });
});
