import './style.css';
import _ from 'lodash';

const element = document.createElement('div');

element.className = 'red';

element.innerHTML = 'hello world';

document.body.append(element);

console.log(_.join([1, 2, 3]));
