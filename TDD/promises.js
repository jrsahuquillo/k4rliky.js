const fs = require('fs');
const should = require('should');
const path = require ('path');


describe('promises', () => {
  it ('should resolve promise', (done) => {
    readCSV('twitter_export.csv')
    .then((content) => {
      content.length.should.be.above(10);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it ('should format CSV', (done) => {
    const content = "Hola Mundo!\nAdiós Mundo!"
    formatCSV(content)
    .then((rows) => {
      rows[0].should.be.eql('Hola Mundo!');
      rows[1].should.be.eql('Adiós Mundo!');
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('should process entire file', (done) => {
    processCSV()
    .then((result) => {
      result.length.should.be.above(10);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('should call promise.all', (done) => {
    Promise.all([
      processCSV(),
      processCSV(),
      processCSV(),
      processCSV(),
      processCSV(),
    ]).then((result) => {
      result.length.should.be.eql(5);
      const [content1,content2,content3] = result;
      content1.length.should.be.above(10);
      content2.length.should.be.above(10);
      content3.length.should.be.above(10);
      done();
    }).catch((err) => {
      done(err);
    });
  });
});

async function processCSV(){
  const fileContent = await readCSV('twitter_export.csv');
  const result = await formatCSV(fileContent);
  return result;
};

function formatCSV(content){
  return new Promise((resolve, reject) => {
    return resolve(content.split("\n"));
  })
}

function readCSV(filename){
  return new Promise((resolve, reject) => {
    fs.readFile(path.join('./csv',filename), (err, content) => {
      if (err) return reject(err);
      resolve(content.toString());
    })
  });
};
