const up = async (knex) => {
  if (await knex.schema.hasTable("roles")) {
    return;
  }
  await knex.schema.createTable("roles", table => {
    table.string("id").notNullable();
    table.string("name").notNullable();
  });
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("roles");
};

module.exports = { up, down }
