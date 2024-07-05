class User {
  constructor(
    id,
    displayName,
    email,
    photoUrl,
    status,
    deviceToken,
    create_at,
    update_at,
  ) {
    this.id = id;
    this.displayName = displayName;
    this.email = email;
    this.photoUrl = photoUrl;
    this.status = status;
    this.deviceToken = deviceToken;
    this.create_at = create_at;
    this.update_at = update_at;
  }
}
export default User;
