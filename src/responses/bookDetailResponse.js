class BookDetailResponse {
  constructor(
    id,
    author,
    category,
    description,
    imageUrl,
    language,
    price,
    publishDate,
    status,
    title,
    bookPreview,
    chapters,
    country,
    listChapters,
    listAudios,
    create_at,
    update_at
  ) {
    (this.id = id),
      (this.author = author),
      (this.category = category),
      (this.description = description),
      (this.imageUrl = imageUrl),
      (this.language = language),
      (this.price = price),
      (this.publishDate = publishDate),
      (this.status = status),
      (this.title = title),
      (this.bookPreview = bookPreview),
      (this.chapters = chapters),
      (this.country = country),
      (this.listChapters = listChapters),
      (this.listAudios = listAudios),
      (this.create_at = create_at),
      (this.update_at = update_at);
  }
}

export default BookDetailResponse;
