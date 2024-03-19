import { reactive } from '../reactive';
import { effect, stop } from '../effect';
describe('effect unit test', () => {
  it('base test case', () => {
    const user = reactive({
      age: 10,
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);
    user.age++;
    expect(nextAge).toBe(12);
  });

  it('should return runner while call effect', () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return 'foo';
    });

    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe('foo');
  });

  it('scheduler', () => {
    let dummy;
    let run;
    const obj = reactive({ foo: 1 });
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler },
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });

  it('stop', () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    // stop后不再监听
    stop(runner);
    obj.prop++;
    expect(dummy).toBe(2);
    // 手动触发仍然可以生效
    runner();
    expect(dummy).toBe(3);
  });

  it('onStop', () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const onStop = jest.fn();
    const runner = effect(
      () => {
        dummy = obj.prop;
      },
      { onStop },
    );

    stop(runner);
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});
