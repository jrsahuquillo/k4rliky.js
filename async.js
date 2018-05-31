var async = require('async');

var arr = ["Karliky", "Sahu", "Clara", "LadyCircus"];

// async.eachOfSeries(arr, function(name, i, callback){
//   setTimeout(function(){
//     console.log(name, i);
//     callback();
//   }, 2000)
// }, function(){
//   console.log("End")
// })

//Idem
// function callback(){
//   console.log("End");
// }
// async.eachOfSeries(arr, function(name, i, next){
//   setTimeout(function(){
//     console.log(name, i);
//     next();
//   }, 2000)
// }, callback);

// -----------------------------------------------------
function callback(){
  console.log("End");
}

async.eachOfSeries(arr, function(name, i, next){
  async.waterfall([
    function sayName(nextStep){
      // console.log(name);
      nextStep();
    },
    function(nextStep){
      console.log(name, i);
      nextStep();
    }
  ], next);
}, callback);

// ------------------------------------------------------
// function callback(err){
//   console.log("End", err);
// }
//
// async.eachOfSeries(arr, function(name, i, next){
//   async.waterfall([
//     function sayName(nextStep){
//       nextStep(new Error("error fatal"), name);
//     },
//     function(name, nextStep){
//       console.log(name, i);
//       nextStep();
//     }
//   ], next);
// }, callback);
