var { User } = require('../../Models/User.js');

/*
 * retrieve a user from the maillist database
 * @param [string or int] pnumber The Phone Number of the user signing up
 * @param [object, string, string] Name, firstname, lastname The Firstname and Lastname of the user signing up
 * @return [user]
 */
module.exports.retrieveuser = (database, id) => {
    database.get('SELECT * FROM users WHERE id=?', id, (err, row) => {
        return new Promise((resolve, reject) => {
            resolve(new User(row.firstname, row.lastname, row.email, row.originip, row.pnumber, row.token, row.id));
            if (err) {
                reject(new Error(err));
            }
            if (!row) {
                reject(new Error("There is no user with that account").field = "id");
            }
            if (token != row.token) {
                reject(new Error("The credentials provided are invalid").field = "token")
            }
        })
    })
}
