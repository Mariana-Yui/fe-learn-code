import moment from 'moment';
import _ from 'lodash';

console.log('hello world');
console.log('moment:', moment());
console.log(_.join(['mariana', 'yui']));

import(/* webpackChunkName: "foo1" *//* webpackMode: "lazy" *//* webpackPrefetch: true */'./bar1').then((v) => {
  console.log(v);
});

import(/* webpackChunkName: "foo2" *//* webpackMode: "lazy" *//* webpackPreload: true */'./bar2').then((v) => {
  console.log(v);
});
