import { reactive } from '../reactive';
import { computed } from '../computed'; 

describe('computed unit test', () => {
  it('happy path', () => {
    const user = reactive({ age: 10 });
    const age = computed(() => {
      return user.age;
    });
    expect(age.value).toBe(10);
  });

  it('should compute lazily', () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    })
    const cValue = computed(getter);

    // lazy 如果不访问cValue, 不执行getter
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // computed依赖的值未改变, 不执行getter
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // computed依赖的值改变, 没有访问, 不执行getter
    value.foo = 2; // 响应式值getter都应该在effect中
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  })
});
