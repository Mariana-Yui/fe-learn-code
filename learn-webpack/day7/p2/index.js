import { add, mul } from './math';
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home.jsx';
import { createApp } from 'vue';
import VueHome from './Home.vue';
import { BrowserRouter } from 'react-router-dom';

console.log('hello world');

add(10, 20);

mul(10, 20);

ReactDOM.render(
  <BrowserRouter>
    <Home />
  </BrowserRouter>,
  document.getElementById('app'),
);

createApp(VueHome).mount('#root');

if (module.hot) {
  module.hot.accept(['./math.js'], () => {
    console.log('hmr executed.');
  });
}
