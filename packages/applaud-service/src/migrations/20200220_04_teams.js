const up = async (knex) => {
  if (await knex.schema.hasTable("teams")) {
    return;
  }
  await knex.schema.createTable("teams", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").notNullable();
  });
  await knex.schema.raw("ALTER TABLE teams AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("teams");
};

module.exports = { up, down }
