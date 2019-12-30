var { User } = require('../../../Models/User.js');
var { retrieveuser } = require('./retrieveuser.js');
/*
 * Create Admin 
 * @param [string] ip  The IP address of the user signing up
 * @param [string or int] pnumber The Phone Number of the user signing up
 * @param [object, string, string] Name, firstname, lastname The Firstname and Lastname of the user signing up 
 * @return [user]
 */
module.exports.createAdmin = async (database, ip, pnumber, email, { firstname, lastname }, token, id) => {
    //return new user
    database.serialize(() => {
        database.run('CREATE TABLE IF NOT EXISTS users(email TEXT, firstname TEXT, lastname TEXT, pnumber TEXT, originip varchar(15), token TEXT, id TEXT, permissions TEXT)')
            .run('INSERT INTO users(email, firstname, lastname, pnumber, originip, token, id, permissions) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [email, firstname, lastname, pnumber, ip, token, id, "ADMIN, SUPERADMIN, MANAGER"])
    });
    return new User(firstname, lastname, email, ip, pnumber, token, id, "MANAGER");
} 