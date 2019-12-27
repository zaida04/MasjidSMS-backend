class User {
    constructor(firstname, lastname, email, ip, pnumber, token, id) {
        this.firstname = firstname;
        this.lastname = lastname;
        this._ip = ip;
        this._email = email;
        this._pnumber = pnumber;
        this._token = token;
        this._id = id;
    }
    //@returns [string] Returns name
    get name() {
        return { firstname: this.firstname, lastname: this.lastname };
    }
    get token() {
        return this._token;
    }
    get id() {
        return this._id;
    }
    //@returns [string] Returns IP
    get ip() {
        return this._ip;
    }
    get email() {
        return this._email;
    }
    //@returns [string] Returns phone number
    get phonenumber() {
        return this._pnumber;
    }
    /*
     * @param [string] x Phone-number to set
     * @returns [User] contains the current User instantiation with the modified phone number
     */
    set phonenumber(x) {
        this._pnumber = x;
        return this;
    }
    toString() {
        return {
            "User": {
                "firstname": this.firstname,
                "lastname": this.lastname,
                "email": this._email,
                "phone_number": this._pnumber,
                "token": this._token,
                "id": this._id,
                "initial_ip": this._ip
            },
            "timestamp": new Date()
        }
    }
}

module.exports.User = User;