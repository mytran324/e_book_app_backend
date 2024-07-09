class Mission {
  constructor(
    id,
    coins,
    detail,
    name,
    times,
    type,
    status,
    create_at,
    update_at
  ) {
    (this.id = id),
      (this.coins = coins),
      (this.detail = detail),
      (this.name = name),
      (this.times = times),
      (this.type = type),
      (this.status = status),
      (this.create_at = create_at),
      (this.update_at = update_at);
  }
}
export default Mission;
