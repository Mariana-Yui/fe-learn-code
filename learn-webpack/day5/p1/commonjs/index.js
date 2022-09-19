// 立即执行函数建立作用域, 避免变量污染
(() => {
  // 定义当前作用域下全局对象, 包含所有require引用的模块
  var __webpack_modules__ = {
    // key为模块路径, 值为包含模块内容的函数
    './util/format.js': (module) => {
      function dateFormat(date) {
        return '2022-09-14';
      }

      function prizeFormat(prize) {
        return '100.00';
      }

      module.exports = {
        dateFormat,
        prizeFormat,
      };
    },
  };
  // 创建对象用于缓存
  var __webpack_module_cache__ = {};
  // commonjs中require函数的polyfill实现
  function __webpack_require__(moduleId) {
    // 根据模块路径获取缓存中的模块内容
    var cachedModule = __webpack_module_cache__[moduleId];
    // 如果存在直接返回
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // 缓存中不存在, 将module变量和在缓存中都初始化一个对象, 属性为exports
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });
    // 将模块内容赋值给module, 从而得到module.exports, 后续能够从缓存中获取
    // 实例中还没用到模块中引用其他模块的情况, 暂不讲解后两个参数
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    // 返回模块内容
    return module.exports;
  }

  var __webpack_exports__ = {};

  // 立即执行函数输出结果
  (() => {
    // 下面引用模块逻辑和打包前源码相同, 不做解释
    const { dateFormat, prizeFormat } = __webpack_require__('./util/format.js');

    console.log(dateFormat(new Date()));
    console.log(prizeFormat(100));
  })();
})();
