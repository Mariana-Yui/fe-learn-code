import { extend } from '../shared';

let activeEffect;
let shouldTrack;

const targetMap = new Map();

export class ReactiveEffect {
  private fn: () => void;
  private deps: any[] = [];
  private active: boolean = true;
  private onStop?: () => void;

  constructor(fn, public scheduler) {
    this.fn = fn;
  }

  run() {
    if (!this.active) {
      return this.fn();
    }

    shouldTrack = true;
    /**
     * important!
     * 在run()中实时更新全局对象activeEffect
     * 保证track时收集的effect是最新的
     *  */ 
    activeEffect = this;
    const result = this.fn();
    shouldTrack = false;

    return result;
  }

  stop() {
    if (this.active) {
      cleanEffect(this);
      this.onStop?.();
      this.active = false;
    }
  }
}

function cleanEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

export function track(target, key) {
  if (!isTracking()) return;
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  trackEffects(deps);
}

export function trackEffects(deps) {
  if (deps.has(activeEffect)) return;
  deps.add(activeEffect);
  // 反向收集依赖,用于stop
  activeEffect.deps.push(deps);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  triggerEffects(deps);
}

export function triggerEffects(deps) {
  deps.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}

export function effect(fn, options: any = {}) {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // options
  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  return runner.effect.stop();
}
