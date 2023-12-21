const AccessLevel = {
  PRIVATE: "private",
  FRIENDS: "friends",
  PUBLIC: "public",
};

class GameRecord {
  constructor(id, sgf, accessLevel = AccessLevel.PRIVATE) {
    this.id = id;
    this.sgf = sgf;
    this.accessLevel = accessLevel;
  }
}
