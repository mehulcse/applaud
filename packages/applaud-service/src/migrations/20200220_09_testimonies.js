const up = async (knex) => {
  if (await knex.schema.hasTable("testimonies")) {
    return;
  }
  await knex.schema.createTable("testimonies", table => {
    table.increments("id").primary();
    table.string("message");
    table.string("type");
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
  await knex.schema.raw("ALTER TABLE testimonies AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("testimonies");
};

module.exports = { up, down }
