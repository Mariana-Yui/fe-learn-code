!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define([], t)
    : 'object' == typeof exports
    ? (exports.math = t())
    : (e.math = t());
})(this, () =>
  (() => {
    'use strict';
    var e = {
        d: (t, o) => {
          for (var r in o) e.o(o, r) && !e.o(t, r) && Object.defineProperty(t, r, { enumerable: !0, get: o[r] });
        },
        o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
        r: (e) => {
          'undefined' != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
            Object.defineProperty(e, '__esModule', { value: !0 });
        },
      },
      t = {};
    function o(e, t) {
      return e + t;
    }
    function r(e, t) {
      return e - t;
    }
    return e.r(t), e.d(t, { add: () => o, minus: () => r }), t;
  })(),
);
