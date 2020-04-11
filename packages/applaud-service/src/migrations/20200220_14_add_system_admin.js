const adminUsers = require("../migrationsData/admin-users.json");
const appRoles = require("../migrationsData/app-roles.json");
const appConstants = require("../migrationsData/app-constants.json");

const up = async (knex) => {
  // insert roles
  appRoles.map(async (role) => {
    await knex("roles").insert({
      id: role.id,
      name: role.name
    });
  });

  // insert admin users
  adminUsers.map(async (user) => {
    await knex("users").insert({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    await knex("userRoles").insert({
      userId: user.id,
      roleId: user.role
    });
    await knex("coinBalance").insert({
      userId: user.id,
      balance: 20
    });
  });

  // insert constants
  appConstants.map(async (constant) => {
    await knex("constants").insert({
      name: constant.name,
      value: constant.value
    });
  });
};

const down = async (knex) => {
  // delete constants
  appConstants.map(async (constant) => {
    await knex("constants").del().where("name", constant.name)
  });

  // delete userRoles
  adminUsers.map(async (user) => {
    await knex("userRoles").del().where("userId", user.id)
  });

  // delete coins
  appRoles.map(async (role) => {
    await knex("coinBalance").del().where("userId", user.id)
  });

  // delete users
  adminUsers.map(async (user) => {
    await knex("users").del().where("userId", user.id)
  });

  // delete roles
  appRoles.map(async (role) => {
    await knex("roles").del().where("roleId", role.id)
  });

};

module.exports = { up, down }
