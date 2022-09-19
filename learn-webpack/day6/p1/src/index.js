/** necessary while useBuiltIns: 'entry' */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const message = 'Hello world';
const foo = (name) => {
  console.log(name);
};

const promise = new Promise((resolve, reject) => {});

foo(message);
