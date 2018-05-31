setTimeout(function(){
  console.log(5);
}, (1000));

setTimeout(function(){
  console.log(5);
  setImmediate(function(){
    console.log("Hello World!")
  })
}, (1000));

setTimeout(function(){
  console.log("end");
}, (3000));
