import moment from 'moment';
import _ from 'lodash';

console.log('hello world');
console.log('moment:', moment());
console.log(_.join(['mariana', 'yui']));

const btn = document.createElement('button');
btn.innerHTML = '加载路由';

btn.addEventListener('click', () => {
  import(/* webpackChunkName: 'element' */ './element').then(({ default: cmp }) => {
    document.body.append(cmp);
  });
});

document.body.append(btn);
