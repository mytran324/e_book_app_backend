class Contact {
    constructor(id, content, status, type, uId, createdAt, updateAt){
        this.id = id;
        this.uId = uId;
        this.content = content;
        this.type = type;
        this.status = status;
        this.createdAt = createdAt;
        this.updateAt = updateAt;
    }
}

export default Contact;