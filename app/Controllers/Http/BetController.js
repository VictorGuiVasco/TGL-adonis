"use strict";

const Bet = use("App/Models/Bet");
const User = use("App/Models/User");
const Mail = use("Mail");

class BetController {
  async index({ auth, request, response }) {
    try {
      const { page } = request.get();
      const bets = await Bet.query()
        .where("user_id", auth.user.id)
        .paginate(page);

      return bets;
    } catch (error) {
      return response.status(400).send(error.message);
    }
  }

  async store({ auth, request, response }) {
    try {
      const data = request.all();
      let totalPrice = 0;
      for (let value in data) {
        totalPrice += data[value].price;
      }

      if (totalPrice < 30) {
        return response
          .status(400)
          .send({ message: "O valor total deve exceder 30 reais " });
      }

      for (let value in data) {
        await Bet.create({ ...data[value], user_id: auth.user.id });
      }

      await Mail.send(
        ["emails.new_bet"],
        {
          username: auth.user.username,
        },
        (message) => {
          message
            .to(auth.user.email)
            .from("victor.vasconcelos@luby.software", "Victor | Luby")
            .subject("Novas apostas salvas");
        }
      );
    } catch (error) {
      return response.status(400).send(error.message);
    }
  }

  async update({ params, request, response }) {
    try {
      const bet = await Bet.findOrFail(params.id);
      const data = request.only(["user_id", "game_id", "numbers", "price"]);

      bet.merge(data);
      await bet.save();

      return bet;
    } catch (error) {
      return response.status(error.status).send(error.message);
    }
  }

  async destroy({ auth, params, response }) {
    try {
      const bet = await Bet.findOrFail(params.id);
      if (auth.user.id !== bet.user_id) {
        return response
          .status(401)
          .send({ message: "Você precisa ser o dono da aposta deleta-la" });
      }

      await bet.delete();
    } catch (error) {
      return response.status(error.status).send(error.message);
    }
  }
}

module.exports = BetController;
