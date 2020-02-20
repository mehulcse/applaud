const up = async (knex) => {
  if (await knex.schema.hasTable("constants")) {
    return;
  }
  await knex.schema.createTable("constants", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("value").notNullable();
  });
  await knex.schema.raw("ALTER TABLE constants AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("constants");
};

module.exports = { up, down }
