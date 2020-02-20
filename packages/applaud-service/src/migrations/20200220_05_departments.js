const up = async (knex) => {
  if (await knex.schema.hasTable("departments")) {
    return;
  }
  await knex.schema.createTable("departments", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").notNullable();
  });
  await knex.schema.raw("ALTER TABLE departments AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("departments");
};

module.exports = { up, down }
