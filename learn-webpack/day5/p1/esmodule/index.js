(() => {
  'use strict';
  var __webpack_modules__ = {
    './util/math.js': (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        default: () => __WEBPACK_DEFAULT_EXPORT__,
      });
      function sum(a, b) {
        return a + b;
      }

      function mul(a, b) {
        return a * b;
      }

      const __WEBPACK_DEFAULT_EXPORT__ = {
        sum,
        mul,
      };
    },
  };

  var __webpack_module_cache__ = {};
  // 和commonjs打包结果类似, exports赋值, 写入缓存, 返回module.exports
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // 缓存
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });
    // exports复制
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    return module.exports;
  }

  (() => {
    // define 这里
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        // 如果definition hasOwnProperty, module.exports没有该属性, 这里是default熟悉
        if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          // 将__webpack_modules__中的属性代理到module.exports中, 和commonjs不同, 不是简单的复制
          Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
      }
    };
  })();

  (() => {
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  (() => {
    // 给当前module.exports添加标识ESM属性
    __webpack_require__.r = (exports) => {
      // 如果浏览器支持Symbol数据类型, 还会添加一个
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      }
      // 添加__esModule属性
      Object.defineProperty(exports, '__esModule', { value: true });
    };
  })();

  // 缓存对象
  var __webpack_exports__ = {};

  (() => {
    __webpack_require__.r(__webpack_exports__);
    var _util_math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('./util/math.js');
    // 使用exports映射default对象的方法
    console.log(_util_math__WEBPACK_IMPORTED_MODULE_0__['default'].sum(10, 20));
    console.log(_util_math__WEBPACK_IMPORTED_MODULE_0__['default'].mul(10, 20));
  })();
})();
