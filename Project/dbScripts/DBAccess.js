const sqlite3 = require('sqlite3').verbose();
//just Connected
exports.establishConnection = function() {


    // DATE
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();
    //
    // today = mm + '/' + dd + '/' + yyyy;
    // console.log(`today is : ${today}`);



  let db = new sqlite3.Database("./db/trainingData.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    } else {
      console.log("success");
    }

  })
  return db;
}

// insert
exports.putData = function(db, data) {
  return new Promise((resolve, reject) => {
    let sqlInsert = `INSERT INTO artCollection (artist, title, creationDate, geoLoc, descript) VALUES ('${data.artist}','${data.title}','${data.creationDate}','${data.geoLoc}','${data.descript}')`;
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
