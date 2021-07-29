"use strict";

const User = use("App/Models/User");
const Mail = use("Mail");

class UserController {
  async index({ auth, request }) {
    const { page } = request.get();
    const users = await User.query().where("id", auth.user.id).paginate(page);

    return auth.user;
  }

  async show({ auth, params, response }) {
    try {
      const user = await User.findByOrFail("id", auth.user.id);

      return user;
    } catch (error) {
      return response.status(404).send({ message: "Users não encontrado" });
    }
  }

  async store({ request }) {
    try {
      const data = request.only(["username", "email", "password"]);
      const user = await User.create(data);

      await Mail.send(
        ["emails.new_user"],
        {
          username: user.username,
        },
        (message) => {
          message
            .to(user.email)
            .from("victor.vasconcelos@luby.software", "Victor | Luby")
            .subject("Boas Vindas");
        }
      );

      return user;
    } catch (error) {
      return response.status(400).send(error.message);
    }
  }

  async update({ auth, params, request, response }) {
    if (auth.user.id !== +params.id) {
      return response
        .status(401)
        .send({ message: "Você precisa ser o usuário para atualizar o id" });
    }
    const user = await User.findOrFail(params.id);
    const data = request.only(["username", "email", "password"]);

    user.merge(data);
    await user.save();

    return user;
  }

  async destroy({ auth, params, response }) {
    if (auth.user.id !== +params.id) {
      return response
        .status(401)
        .send({ message: "Você precisa ser o usuário para deletar o id" });
    }
    const user = await User.findOrFail(params.id);

    await user.delete();
  }
}

module.exports = UserController;
