class User {
    constructor(id, fullName, email, imageUrl, passWord, phoneNumber, provider, status) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.imageUrl = imageUrl;
        this.passWord = passWord;
        this.phoneNumber = phoneNumber;
        this.provider = provider;
        this.status = status;
    }
}
module.exports = User;