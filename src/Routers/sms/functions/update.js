var { User } = require('../../Models/User.js');

/*
 * update info function to the maillist database
 * @param [string] ip  The IP address of the user updating
 * @param [string or int] pnumber The Phone Number of the user updating 
 * @param [object, string, string] Name, firstname, lastname The Firstname and Lastname of the user updating
 * @return [user]
 */
module.exports.updateMailList = (user) => {
    return new User(firstname, lastname, email, ip, pnumber);
}

