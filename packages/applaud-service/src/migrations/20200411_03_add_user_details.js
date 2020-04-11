const userDetails = require("../migrationsData/user-details.json");

const up = async (knex) => {
  // insert user details
  userDetails.map(async (userDetail) => {
    const user = await knex("users").where({
      email: userDetail.email
    });
    if (user && user[0] && user[0].id) {
      await knex("userDetails").insert({
        userId: user[0].id,
        slackHandle: userDetail.slackHandle
      });
    }
  });
};

const down = async (knex) => {
  // delete userDetails
  userDetails.map(async (userDetail) => {
    const user = await knex("users").where({
      email: userDetail.email
    });
    if (user && user[0] && user[0].id) {
      await knex("userDetails").del().where("userId", user[0].id)
    }
  });
};

module.exports = { up, down }
