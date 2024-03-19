import { track, trigger } from './effect';
import { ReactiveFlags, reactive, readonly } from './reactive';
import { extend, isObject } from '../shared';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    if (!isReadonly) {
      // 依赖收集
      track(target, key);
    }

    if (!shallow && isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    // 触发依赖
    trigger(target, key);
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const shallowMutableHandlers = extend({}, mutableHandlers, {
  get: shallowReactiveGet,
});

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, val) {
    console.warn('readonly');
    return true;
  },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
