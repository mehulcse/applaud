const up = async (knex) => {
  if (await knex.schema.hasTable("userTemporaryLoginCodes")) {
    return;
  }
  await knex.schema.createTable("userTemporaryLoginCodes", table => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table.string("code", 255).notNullable();
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp("expiresAt")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("userTemporaryLoginCodes");
};

module.exports = { up, down }
