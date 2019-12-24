var { User } = require('../../Models/User.js');

/*
 * Signup function to the maillist database
 * @param [string] ip  The IP address of the user signing up
 * @param [string or int] pnumber The Phone Number of the user signing up
 * @param [object, string, string] Name, firstname, lastname The Firstname and Lastname of the user signing up 
 * @return [user]
 */
module.exports.signupMailList = (ip, pnumber, email, { firstname, lastname }) => {
    //return new user
    return new User(firstname, lastname, email, ip, pnumber);
}

