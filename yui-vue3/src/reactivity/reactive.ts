import { track, trigger } from './effect';
import { mutableHandlers, readonlyHandlers, shallowMutableHandlers, shallowReadonlyHandlers } from './basehandlers';
import { isObject } from '../shared';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers);
}

export function shallowReactive(raw) {
  return createActiveObject(raw, shallowMutableHandlers);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

export function createActiveObject(raw, baseHandler) {
  if (!isObject(raw)) {
    console.warn(`target ${raw} is not Object`);
  }
  return new Proxy(raw, baseHandler);
}
