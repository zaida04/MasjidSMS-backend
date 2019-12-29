//Constructor example new APIError("error message", status, field where error is, value of error)
//ex. new User(errors.array()[0.msg, 500, errors.array()[0].param, errors.array()[0].value)
class APIError extends Error {
    constructor(msg, status, field, value) {
        super(`There is an error with the field: ${field}, with the error: ${msg}, and the bad value: ${value}`);
        this._status = status || 500; //status code
        this._msg = msg;
        this._field = field; //the field where the bad value is
        this._value = value; //the bad value
    }
    get msg() {
        return this._msg
    }
    get status() {
        return this._status;
    }
    get field() {
        return this._field;
    }
    get value() {
        return this._value;
    }
}

module.exports.APIError = APIError;