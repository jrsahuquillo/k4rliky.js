// function Person(name) {
//   this.name = name;
//   this.getName = function(){
//     return this.name;
//   }
// }
//
// Person.prototype.setName = function(name){
//   this.name = name;
// }
//
// var person = new Person("Sahu");
// console.log(person.getName());
//
// person.setName("Carlos");
// console.log(person.getName());

const PersonDefinition = {
  "age": 5,
  "setAge": function(callback){
    callback(this.age);
  }
};
global.name = "Carlos2"
const Person = {
  "name": "Sahu",
  "getName": function(){
    return this.name
  },
  "setName": function(name){
    this.__setName(name);
  },
  "__setName": function(name){
    this.name = name
  },
  "getDefinition": function(){
    return this.name;
  }
};
console.log(Person)
console.log(Person.name)
console.log(Person.getName())
Person.setName("Carlos")
console.log(Person.getName())
Person.getDefinition();

const myPerson = Person.getDefinition;
console.log(myPerson.bind(Person)());

// function Person(){
//   "use strict";
//   this.name = "Carlos"
// }
//
// console.log(new Person());
