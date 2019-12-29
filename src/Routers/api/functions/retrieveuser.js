var { User } = require('../../Models/User.js');

/*
 * retrieve a user from the maillist database
 * @param [string or int] pnumber The Phone Number of the user signing up
 * @param [object, string, string] Name, firstname, lastname The Firstname and Lastname of the user signing up
 * @return [user]
 */
module.exports.retrieveuser = async (database, id, token) => {
    return new Promise((resolve, reject) => {
        database.get('SELECT * FROM users WHERE id=? OR token=?', [id, token], (err, row) => {
            if (err) {
                reject(new Error(err));
            }
            if (!row) {
                reject(new Error("There is no user with that account"));
            } else {
                resolve(new User(row.firstname, row.lastname, row.email, row.originip, row.pnumber, row.token, row.id, row.permissions));
            }
        })
    })
}
