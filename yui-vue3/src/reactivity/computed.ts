import { ReactiveEffect } from './effect';
import { trackRefValue, triggerRefValue } from './ref';

class ComputedRefImpl {
  private _getter: () => any;
  private _value: any;
  private _dirty = true;
  private deps = [];
  private _effect: any;
  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
  }

  get value() {
    trackRefValue(this);
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}
export function computed(getter) {
  return new ComputedRefImpl(getter);
}
