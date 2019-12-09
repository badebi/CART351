const sqlite3 = require('sqlite3').verbose();
//just Connected
exports.establishConnection = function() {

  let db = new sqlite3.Database("./db/trainingData.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    } else {
      console.log("db success");
    }

  })
  return db;
}

// insert
exports.putData = function(db, data) {
  return new Promise((resolve, reject) => {
    // DATE
    let today = new Date().toLocaleDateString();
    let sqlInsert = `INSERT INTO trainingData${today.replace(/[/-]/g, "")} (joke, funniness) VALUES ('${data.data}','${data.response}')`;
    console.log("data::" + data)
    db.run(sqlInsert, (err) => {
      if (err) return reject(err);
      resolve("inserted entry");
    });
  });
};

exports.fetchData = function(db, theQuery) {
  return new Promise((resolve, reject) => {
    //using the all
    db.all(theQuery, [], (err, resultSet) => {
      if (err) return reject(err);
      //return the resultSet
      resolve(resultSet);
    });
  });
};
