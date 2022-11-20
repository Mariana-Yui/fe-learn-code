console.log('hello main');

import(/* webpackPrefetch: true *//* webpackChunkName: 'foo' */'./foo.js').then((v) => {
  console.log(v);
});
