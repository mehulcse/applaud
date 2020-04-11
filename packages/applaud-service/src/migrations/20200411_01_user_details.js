const up = async (knex) => {
  if (await knex.schema.hasTable("userDetails")) {
    return;
  }
  await knex.schema.createTable("userDetails", table => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .string("slackHandle");
  });
  await knex.schema.raw("ALTER TABLE userDetails AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("userDetails");
};

module.exports = { up, down }
