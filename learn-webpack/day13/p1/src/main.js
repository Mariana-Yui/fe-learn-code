import code from './doc.md';
import 'highlight.js/styles/atom-one-dark.css';

console.log('Hello Loader');

const message = 'Hello World';
console.log(message);

const foo = () => {
  console.log('foo');
};

foo();

document.body.innerHTML = code;