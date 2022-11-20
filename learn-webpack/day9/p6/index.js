// import './style.css';

const hello = 'hello world';
console.log(hello);

function sum(num1, num2) {
  return arguments[0] + arguments[1];
}

console.log(sum(10, 20));

if (process.env.NODE_ENV === 'production') {
  console.log("can reach here!");
}