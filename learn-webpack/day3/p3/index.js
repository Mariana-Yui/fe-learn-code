import './css/style.scss';
// import girl from './img/girl.png'; /** import or require() */
import './font/iconfont.css';

function component() {
  const element = document.createElement('div');
  element.innerHTML = ['hello', 'world'].join(' ');
  element.classList.add('content');

  const imgEl = new Image();
  imgEl.width = 300;
  imgEl.height = 150;
  imgEl.src = require('./img/girl.png');
  element.appendChild(imgEl);

  const bgDivEl = document.createElement('div');
  bgDivEl.style.width = '300px';
  bgDivEl.style.height = '150px';
  bgDivEl.className = 'bg-image';
  bgDivEl.style.backgroundColor = '#ff0000';
  element.appendChild(bgDivEl);

  const iEl = document.createElement('i');
  iEl.className = 'iconfont myui-font icon-kafei';
  element.appendChild(iEl);

  return element;
}

document.body.append(component());
