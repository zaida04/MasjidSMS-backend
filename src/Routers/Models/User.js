class User {
    constructor(firstname, lastname, email, ip, pnumber, token, id, permissions) {
        this._firstname = firstname;
        this._lastname = lastname;
        this._ip = ip;
        this._email = email;
        this._pnumber = pnumber;
        this._token = token;
        this._id = id;
        this._permissions = permissions;
    }
    //@returns [string] Returns name
    get name() {
        return { firstname: this._firstname, lastname: this._lastname };
    }
    get firstname() {
        return this._firstname;
    }
    get lastname() {
        return this._lastname;
    }
    get token() {
        return this._token;
    }
    get permissions() {
        return this._permissions;
    }
    set permissions(x) {
        this._permissions += x;
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
    get pnumber() {
        return this._pnumber;
    }
    /*
     * @param [string] x Phone-number to set
     * @returns [User] contains the current User instantiation with the modified phone number
     */
    set pnumber(x) {
        this._pnumber = x;
        return this;
    }
    /*
     * @param [string] x firstname to be set 
     * @return {User}
     */
    set firstname(x) {
        this._firstname = x;
        return this;
    }
    /*
     * @params [string] x lastname of user 
     * @return {User} 
     */
    set lastname(x) {
        this._lastname = x;
        return this;
    }
    /*
     * @params [string] x email of user 
     * @return {User}
     */
    set email(x) {
        this._email = x;
        return this;
    }
    toString() {
        return {
            "User": {
                "firstname": this._firstname,
                "lastname": this._lastname,
                "email": this._email,
                "phone_number": this._pnumber,
                "token": this._token,
                "id": this._id,
                "initial_ip": this._ip,
                "permissions": this._permissions
            },
            "timestamp": new Date()
        }
    }
}

module.exports.User = User;