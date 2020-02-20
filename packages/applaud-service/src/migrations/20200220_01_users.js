const up = async (knex) => {
  if (await knex.schema.hasTable("users")) {
    return;
  }
  await knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("email").notNullable();
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.schema.raw("ALTER TABLE users AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("users");
};

module.exports = { up, down }
