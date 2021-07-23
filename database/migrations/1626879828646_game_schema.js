"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class GameSchema extends Schema {
  up() {
    this.create("games", (table) => {
      table.increments();
      table.string("type", 20).notNullable().unique();
      table.text("description").notNullable();
      table.integer("range").notNullable();
      table.decimal("price").notNullable();
      table.integer("max_number").notNullable();
      table.string("color", 20).notNullable();
      table.integer("min_cart_value").notNullable();

      table.timestamps();
    });
  }

  down() {
    this.drop("games");
  }
}

module.exports = GameSchema;
