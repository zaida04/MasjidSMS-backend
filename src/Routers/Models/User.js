class User {
    constructor(firstname, lastname, email, ip, pnumber) {
        this.firstname = firstname;
        this.lastname = lastname;
        this._ip = ip;
        this._email = email;
        this._pnumber = pnumber;
    }
    //@returns [string] Returns name
    get name() {
        return { firstname: this.firstname, lastname: this.lastname };
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
}

module.exports.User = User;