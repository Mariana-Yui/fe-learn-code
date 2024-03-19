import { hasChanged, isObject } from '../shared';
import { isTracking, trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

/**
 * ref参数可以是基本类型 1, true, "123"
 * 如何监听/触发监听? 就需要一个.value进行getter/setter
 * proxy -> 对象, ref参数如果是对象,则交给reactive处理
 */
class RefImpl {
  private _value: any;
  public deps;
  private _rawValue: any;
  private __v_isRef = true;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.deps = new Set();
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerRefValue(this);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.deps);
  }
}

export function triggerRefValue(ref) {
  const deps = ref.deps;
  deps && triggerEffects(deps);
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      /**
       * get ref -> .value
       * get non-ref -> raw value
       */
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      /**
       * set non-ref to ref -> .value
       * set others -> direct set
       */
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
