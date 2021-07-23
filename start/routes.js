"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("users", "UserController.index");
Route.post("users", "UserController.store").validator("User");

Route.post("session", "SessionController.store").validator("Session");

Route.post("password", "ForgotPasswordController.store").validator(
  "ForgotPassword"
);
Route.put("password", "ForgotPasswordController.update").validator(
  "ResetPassword"
);

Route.group(() => {
  Route.get("users/:email", "UserController.show");
  Route.put("users/:id", "UserController.update");
  Route.delete("users/:id", "UserController.destroy");

  Route.resource("games", "GameController").apiOnly();
  Route.resource("bets", "BetController").apiOnly();
}).middleware(["auth"]);
