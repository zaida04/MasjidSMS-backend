var { APIError } = require('../../Models/apierror.js');

module.exports.apicatcher = (validator, req) => {
    var errors = validator(req);
    if (!errors.isEmpty()) {
        throw new APIError(errors.array()[0].msg, 400, errors.array()[0].param, errors.array()[0].value);
    }
}