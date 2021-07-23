"use strict";

const User = use("App/Models/User");
const Mail = use("Mail");

class UserController {
  async index({ request }) {
    const { page } = request.get();
    const users = await User.query().paginate(page);

    return users;
  }

  async show({ params, response }) {
    try {
      const user = await User.findByOrFail("email", params.email);

      return user;
    } catch (error) {
      return response.status(404).send({ message: "Email não encontrado" });
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

  async update({ params, request }) {
    const user = await User.findOrFail(params.id);
    const data = request.only(["username", "email", "password"]);

    user.merge(data);
    await user.save();

    return user;
  }

  async destroy({ auth, params, response }) {
    if (auth.user.id !== params.id) {
      return response
        .status(401)
        .send({ message: "Você precisa ser o usuário para deletar o id" });
    }
    const user = await User.findOrFail(params.id);

    await user.delete();
  }
}

module.exports = UserController;
