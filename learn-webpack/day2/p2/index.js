/** loader内联方式 */
// import 'css-loader!./style.css';
import './css/style.css';
import './css/style.scss';

function component() {
  const element = document.createElement('div');
  element.innerHTML = ['hello', 'world'].join(' ');
  element.classList.add('content');

  return element;
}

document.body.append(component());
