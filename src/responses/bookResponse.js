class BookResponse {
  constructor(id, author, price, title, view, create_at, update_at) {
    (this.id = id),
      (this.author = author),
      (this.price = price),
      (this.title = title),
      (this.view = view),
      (this.create_at = create_at),
      (this.update_at = update_at);
  }
}

export default BookResponse;
