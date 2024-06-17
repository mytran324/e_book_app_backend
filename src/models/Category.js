class Category {
  constructor(id, name, status, imageUrl, create_at, update_at) {
    (this.id = id),
      (this.name = name),
      (this.status = status),
      (this.imageUrl = imageUrl),
      (this.create_at = create_at),
      (this.update_at = update_at);
  }
}

export default Category;
