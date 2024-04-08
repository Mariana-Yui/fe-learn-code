import { isReadonly, shallowReadonly } from '../reactive';

describe('shallowReadonly', () => {
  it('should not make non-reactive properties reactive', () => {
    const observed = shallowReadonly({ foo: 1, bar: { baz: 2 } });
    expect(isReadonly(observed)).toBe(true);
    expect(isReadonly(observed.bar)).toBe(false);
  });

  it('call warn while set', () => {
    console.warn = jest.fn();
    const obj = shallowReadonly({ foo: 1 });
    obj.foo = 2;
    expect(console.warn).toHaveBeenCalled();
  });
});
