export const Permission = {
  PRIVATE: "private",
  FRIENDS: "friends",
  PUBLIC: "public",
};

export class GameRecord {
  constructor(id, sgf, permission = Permission.PRIVATE) {
    this.id = id;
    this.sgf = sgf;
    this.timestamp = new Date().toISOString();
    this.permission = permission;
  }
}
