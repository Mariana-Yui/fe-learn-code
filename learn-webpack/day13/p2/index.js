const {
  SyncHook,
  SyncBailHook,
  SyncLoopHook,
  SyncWaterfallHook,
  AsyncParallelHook,
  AsyncSeriesHook,
} = require('tapable');

class LearnTapable {
  constructor() {
    this.hooks = {
      // syncHook: new SyncHook(['name', 'age']),
      // syncHook: new SyncBailHook(['name', 'age']),
      // syncHook: new SyncLoopHook(['name', 'age']),
      syncHook: new SyncWaterfallHook(['name', 'age']),
      // asyncHook: new AsyncSeriesHook(['name', 'age']),
      asyncHook: new AsyncParallelHook(['name', 'age']),
    };

    // this.hooks.syncHook.tap('event1', (name, age) => {
    //   console.log('event1', name, age);
    //   return 'yui';
    // });

    // this.hooks.syncHook.tap('event2', (name, age) => {
    //   console.log('event2', name, age);
    // });

    // this.hooks.asyncHook.tapAsync('event1', (name, age, callback) => {
    //   setTimeout(() => {
    //     console.log('event1', name, age);
    //     callback();
    //   }, 1000);
    // });

    // this.hooks.asyncHook.tapAsync('event2', (name, age, callback) => {
    //   setTimeout(() => {
    //     console.log('event2', name, age);
    //     callback();
    //   }, 2000);
    // });
    this.hooks.asyncHook.tapPromise('event1', (name, age) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('event1', name, age);
          resolve();
        });
      });
    });

    this.hooks.asyncHook.tapPromise('event1', (name, age) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('event1', name, age);
          resolve();
        });
      });
    });
  }

  emit() {
    // this.hooks.syncHook.call('mariana', 8);
    // this.hooks.asyncHook.callAsync('mariana', 8, () => {
    //   console.log('执行完成');
    // });
    this.hooks.asyncHook.promise('mariana', 8).then(() => {
      console.log('执行完成');
    });
  }
}

const lt = new LearnTapable();
lt.emit();
