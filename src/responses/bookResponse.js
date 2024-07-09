class BookResponse {
  constructor(id, author, price, title, create_at, update_at, totalBook) {
    (this.id = id),
      (this.author = author),
      (this.price = price),
      (this.title = title),
      (this.create_at = create_at),
      (this.update_at = update_at),
      (this.totalBook = totalBook);
  }
}

export default BookResponse;
