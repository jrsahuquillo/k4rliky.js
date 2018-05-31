function getName(){
  throw new Error("Unexpected error");
}

function sayName(){
  var message = "";
  try {
    console.log("try")
    getName()
  } catch (e) {
    console.log("catch")
    message = e;
  } finally {
    console.log("finally")
    return message;
  }
}

console.log(sayName());
