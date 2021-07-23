"use strict";

const Game = use("App/Models/Game");

class GameController {
  async index({ request }) {
    try {
      const { page } = request.get();
      const games = await Game.query().paginate(page);

      return games;
    } catch (error) {
      return response.status(error.status).send(error.messages);
    }
  }

  async store({ request, response }) {
    try {
      const data = request.only([
        "type",
        "description",
        "range",
        "price",
        "max_number",
        "color",
        "min_cart_value",
      ]);

      const game = await Game.create(data);

      return game;
    } catch (error) {
      return response.status(error.status).send(error.messages);
    }
  }

  async show({ params }) {
    try {
      const game = await Game.findOrFail(params.id);

      return game;
    } catch (error) {
      return response.status(error.status).send(error.messages);
    }
  }

  async update({ params, request, response }) {
    try {
      const game = await Game.findOrFail(params.id);
      const data = request.only([
        "type",
        "description",
        "range",
        "price",
        "max_number",
        "color",
        "min_cart_value",
      ]);

      game.merge(data);
      await game.save();

      return game;
    } catch (error) {
      return response.status(error.status).send(error.messages);
    }
  }

  async destroy({ params, response }) {
    try {
      const game = await Game.findOrFail(params.id);

      await game.delete();
    } catch (error) {
      return response.status(error.status).send(error.messages);
    }
  }
}

module.exports = GameController;
