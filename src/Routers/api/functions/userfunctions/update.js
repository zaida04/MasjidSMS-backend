var { User } = require('../../../Models/User.js');

/*
 * update info function to the maillist database
 * @param [string] ip  The IP address of the user updating
 * @param [string or int] pnumber The Phone Number of the user updating 
 * @param [object, string, string] Name, firstname, lastname The Firstname and Lastname of the user updating
 * @return [user]
 */
module.exports.updateuser = async (database, user) => {
    return new Promise((resolve, reject) => {
        database.run('UPDATE users SET firstname=?, lastname=?, email=?, pnumber=? WHERE id=?', [user.firstname, user.lastname, user.email, user.pnumber, user.id])
        database.get('SELECT * from users where id=?', user.id, (err, row) => {
            resolve(new User(row.firstname, row.lastname, row.email, row.originip, row.pnumber, row.token, row.id, row.permissions));
        });
    })
}

