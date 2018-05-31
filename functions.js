// (function sayName(name){
//   console.log(name);
// })("Sahu");


function printInfo(name, age){
  console.log(arguments[0],arguments[1], arguments[2]);
  console.log(arguments.length)
  console.log(arguments.callee.length)
  console.log(typeof arguments)

};

printInfo("sahu", 40,6,3)

console.log(printInfo.length)
