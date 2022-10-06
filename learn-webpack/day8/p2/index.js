import moment from 'moment';
import _ from 'lodash';

console.log('hello world');
console.log('moment:', moment());
console.log(_.join(['mariana', 'yui']));

import(/* webpackChunkName: "foo1" */'./bar1').then((v) => {
  console.log(v);
});

import(/* webpackChunkName: "foo2" */'./bar2').then((v) => {
  console.log(v);
});
