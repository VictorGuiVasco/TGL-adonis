"use strict";

class SessionController {
  async store({ auth, request, response }) {
    try {
      const { email, password } = request.all();
      const token = await auth.attempt(email, password);

      return token;
    } catch (error) {
      return response.status(error.status).send(error);
    }
  }
}

module.exports = SessionController;
