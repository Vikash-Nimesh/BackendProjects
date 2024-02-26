var x = 10;
function a(){
    console.log(x)
}




//we cant use without declaration
y = 10;
console.log(y)
let y;


// we cant use without declaration & we cant use without intialization
const z = 10
console.log(z)


// JavaScript Hoisting
// JavaScript Declarations are Hoisted
// In JavaScript, a variable can be declared after it has been used.

x = 5;
console.log(x);
var x;

