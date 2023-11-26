class Review {
    constructor (bookId, content, rating, status, userId) {
        this.bookId = bookId,
        this.content = content,
        this.rating = rating,
        this.status = status,
        this.userId = userId
    }
}
module.exports = Review;