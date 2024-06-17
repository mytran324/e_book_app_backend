class Mission {
  constructor(
    missionId,
    coins,
    detail,
    name,
    times,
    type,
    create_at,
    update_at
  ) {
    (this.missionId = missionId),
      (this.coins = coins),
      (this.detail = detail),
      (this.name = name),
      (this.times = times),
      (this.type = type),
      (this.create_at = create_at),
      (this.update_at = update_at);
  }
}
export default Mission;
