const sqlite3 = require('sqlite3').verbose(); //the db

/*
 * Create a database object
 * @return {db}
 */
module.exports.opendb = (name) => {
    return new sqlite3.Database(`./${name}.db`, (err) => { if (err) { console.error(err); } }); //open up the database
}