var { User } = require('../../Models/User.js');

/*
 * retrieve a user from the maillist database
 * @param [string or int] pnumber The Phone Number of the user signing up
 * @param [object, string, string] Name, firstname, lastname The Firstname and Lastname of the user signing up
 * @return [user]
 */
module.exports.retrieveuser = (firstname, lastname, email, pnumber) => {
    return new User(/*firstname, lastname, ip, email, and phone number from db*/);
}
