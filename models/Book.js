class Book {
    constructor (id, authodId, categoryId, description, imageUrl, language, price, publishDate, status, title, bookPreview, chapters, country){
        this.id = id,
        this.authodId = authodId,
        this.categoryId = categoryId,
        this.description = description,
        this.imageUrl = imageUrl,
        this.language = language,
        this.price = price,
        this.publishDate = publishDate,
        this.status = status,
        this.title = title,
        this.bookPreview = bookPreview,
        this.chapters = chapters,
        this.country = country
    }
}

module.exports = Book;