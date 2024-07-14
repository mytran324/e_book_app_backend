class ContactResponse {
    constructor(id, content, status, type, user, createdAt, updateAt){
        this.id = id;
        this.user = user;
        this.content = content;
        this.type = type;
        this.status = status;
        this.createdAt = createdAt;
        this.updateAt = updateAt;
    }
}

export default ContactResponse;