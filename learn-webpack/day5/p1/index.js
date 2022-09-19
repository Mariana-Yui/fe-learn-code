const { dateFormat, prizeFormat } = require('./util/format');

import math from './util/math';

console.log(dateFormat('2022-09-16'));
console.log(prizeFormat(100));
console.log(math.sum(10, 20));
console.log(math.mul(10, 20));
