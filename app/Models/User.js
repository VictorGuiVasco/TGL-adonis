"use strict";

const Hash = use("Hash");

const Model = use("Model");

class User extends Model {
  static boot() {
    super.boot();

    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  bets() {
    return this.hasMany("App/Models/Bet");
  }

  tokens() {
    return this.hasMany("App/Models/Token");
  }
}

module.exports = User;
