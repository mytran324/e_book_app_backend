class Review {
  constructor(bookId, content, rating, status, userId, create_at, update_at) {
    (this.bookId = bookId),
      (this.content = content),
      (this.rating = rating),
      (this.status = status),
      (this.userId = userId),
      (this.create_at = create_at),
      (this.update_at = update_at);
  }
}
export default Review;
