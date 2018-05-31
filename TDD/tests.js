var fs = require('fs');
var should = require('should');
var async = require('async');

describe('Read CSV file', () => {
  it('checks if filename exists', done => {
    readCSV(undefined, (err) => {
      should(err.message).be.eql("FILENAME_NOT_FOUND");
      done();
    })
  });

  it('should fail if file not exists', done => {
    readCSV("filename.csv", (err) => {
      should(err.message).be.eql("FILENAME_NOT_EXIST");
      done();
    })
  });

  it('should read file content', done => {
    readCSV("csv/twitter_export.csv - twitter_export.csv.csv", (err, content) => {
      should.not.exist(err);
      should.exist(content);
      done();
    })
  });
});

describe('Formats CSV', () => {
  it('should fail if no data is given', done => {
    formatCSV(undefined, (err) => {
      should(err.message).be.eql("EMPTY_DATA");
      done();
    })
  });

  it('should return formated data', done => {
    var data = "Data content \n Data content \n Data content"
    formatCSV(data, (err, content) => {
      should.not.exist(err);
      should.exist(content);
      content.length.should.be.eql(2);
      done();
    })
  });

  it('should return data with columns', done => {
    var data = "\n0101;k4rliky;40;10;10;Sat Nov 30 11:00:16 +0000 2013;;hola"
    formatCSV(data, (err, content) => {
      should.not.exist(err);
      should.exist(content);
      content.length.should.be.eql(1);
      content[0].should.be.eql({
        tweetid: '0101',
        screen_name: 'k4rliky',
        followers: 40,
        retweets: 10,
        favs: 10,
        date: new Date('Sat Nov 30 11:00:16 +0000 2013'),
        link: '',
        text: 'hola'
      })
      done();
    })
  });
});

describe('Process CSV', () => {
  xit('should return data with columns', done => {
    formatCSV(data, (err, content) => {
      should.not.exist(err);
      should.exist(content);
      content.length.should.be.eql(1);
      content[0].should.be.eql({
        tweetid: '0101',
        screen_name: 'k4rliky',
        followers: 40,
        retweets: 10,
        favs: 10,
        date: new Date('Sat Nov 30 11:00:16 +0000 2013'),
        link: '',
        text: 'hola'
      })
      done();
    });
  });

  it('should fail if no filename is given', done => {
    processCSV("", (err) => {
      should(err.message).be.eql("FILENAME_NOT_FOUND");
      done();
    });
  });

  it('should return all data formatted', done => {
    const filename = "csv/twitter_export.csv";
    processCSV(filename, (err, tweets) => {
      should.not.exist(err);
      tweets.length.should.be.eql(10);
      tweets[0].tweetid.should.be.eql("405863650105118700");
      done();
    });
  });
});

describe('Extract insights', () => {
  it('should return top retweets ids', done => {
    const filename = "csv/twitter_export.csv";
    getTopRelevantTweets(filename, (err, tweets) => {
      should.not.exist(err);
      tweets[0].tweetid.should.be.eql("405140125773869060");
      done();
    });
  });

  it('should return top favorited ids', done => {
    const filename = "csv/twitter_export.csv";
    getTopFavoritedTweets(filename, (err, tweets) => {
      should.not.exist(err);
      tweets[0].tweetid.should.be.eql("406256240113614850"); //first element
      done();
    });
  });

  it('should return best time to tweet', done => {
    const filename = "csv/twitter_export_simple.csv";

    getBestTimeToTweet(filename, (err, btt) => {
      should.not.exist(err);
      btt.should.be.eql([
        [0,0,0,0,1,0,0], // 0:00 - 6:00
        [0,0,0,0,0,0,0], // 6:00 - 12:00
        [0,0,0,0,0,0,0], // 12:00 - 18:00
        [0,0,0,0,0,0,0] // 18:00 - 23:59
      ]);
      done();
    });
  });

  it('should return best time to tweet', done => {
    const filename = "csv/twitter_export_many.csv";

    getBestTimeToTweet(filename, (err, btt) => {
      should.not.exist(err);
      btt.should.be.eql([
        [ 0, 0, 1, 2, 2, 3, 0 ], // 0:00 - 6:00
        [ 0, 0, 1, 2, 2, 2, 0 ], // 6:00 - 12:00
        [ 0, 0, 0, 0, 0, 0, 0 ], // 12:00 - 18:00
        [ 0, 0, 2, 1, 0, 0, 0 ] // 18:00 - 23:59
      ]);
      done();
    });
  });
});


// Functions

function readCSV(filename, cb) {
  if (!filename) return cb(new Error("FILENAME_NOT_FOUND"));
  async.waterfall([
    next => _checkFileExists(filename, next),
    next => _readFile(filename, next)
  ],cb);

  function _checkFileExists(filename, next) {
    fs.stat(filename, (err) => {
      if (!err) return next();
      if (err.code === "ENOENT") return next(new Error("FILENAME_NOT_EXIST"));
      return next(err);
    });
  };

  function _readFile(filename, next) {
    fs.readFile(filename, "utf8", next);
  }
};

function formatCSV(content, cb) {
  if (!content) return cb(new Error("EMPTY_DATA"));
  var rows = content.split("\n");
  rows.shift();
  var data = rows.map(line => {
    var splittedData = line.split(';');
    return {
      tweetid: splittedData[0],
      screen_name: splittedData[1],
      followers: Number(splittedData[2]),
      retweets: Number(splittedData[3]),
      favs: Number(splittedData[4]),
      date: new Date(splittedData[5]),
      link: splittedData[6],
      text: splittedData[7]
    };
  })
  cb(null, data);
};

function processCSV(filename, cb) {
  async.waterfall([
    next => readCSV(filename, next),
    (content, next) => formatCSV(content, next)
  ],cb);
};

function getTopRelevantTweets(filename, cb){
  async.waterfall([
    next => processCSV(filename, next),
    (tweets, next) => _getTopRelevantTweets(tweets, next)
  ], cb);

  function _getTopRelevantTweets(tweets, next) {
    const result = tweets.sort((a, b) => b.retweets - a.retweets);
    next(null, result);
  };
};

function getTopFavoritedTweets(filename, cb){
  async.waterfall([
    next => processCSV(filename, next),
    (tweets, next) => _getTopFavoritedTweets(tweets, next)
  ], cb);

  function _getTopFavoritedTweets(tweets, next) {
    const result = tweets.sort((a, b) => b.favs - a.favs);
    next(null, result);
  };
};

function getBestTimeToTweet(filename, cb) {
  var btt = [
    [0,0,0,0,0,0,0], // 0:00 - 6:00
    [0,0,0,0,0,0,0], // 6:00 - 12:00
    [0,0,0,0,0,0,0], // 12:00 - 18:00
    [0,0,0,0,0,0,0] // 18:00 - 23:59
  ];
  async.waterfall([
    next => processCSV(filename, next),
    (tweets, next) => _getBestTimeToTweet(tweets, next)
  ], cb);

  function _getBestTimeToTweet(tweets, next) {
    tweets.forEach( (tweet)=> {
      var weekDay = tweet.date.getDay();
      var timeOfDay = getTimeOfDay(tweet.date);
      btt[timeOfDay][weekDay] += 1
    })
    next(null, btt);
  };

  function getTimeOfDay(date) {
    var hours = date.getHours();

    if (hours >= 0 && hours <= 6) {
      return 0;
    } else if (hours > 6 && hours <= 12){
      return 1;
    } else if (hours > 12 && hours <= 18) {
      return 2;
    } else {
      return 3;
    };
  };
};
