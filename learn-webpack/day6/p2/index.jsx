import React, { Component } from 'react';
import ReactDOM from 'react-dom';

function Home() {
  return (
    <div>
      <h2>Hello World</h2>
    </div>
  );
}
// class Home extends Component {
//   constructor() {
//     super();
//     this.state = {
//       content: 'Hello World',
//     };
//   }
//   render() {
//     return (
//       <div>
//         <h2>{this.state.content}</h2>
//       </div>
//     );
//   }
// }

ReactDOM.render(<Home />, document.getElementById('app'));
