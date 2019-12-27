var { APIError } = require('../../Models/apierror.js');

module.exports.isPN = (str) => {
    if (!str.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
        throw new APIError("not a phone number", 500, "phone_number", str.pnumber);
    }
}