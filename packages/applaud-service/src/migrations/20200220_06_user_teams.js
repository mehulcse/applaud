const up = async (knex) => {
  if (await knex.schema.hasTable("userTeams")) {
    return;
  }
  await knex.schema.createTable("userTeams", table => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .integer("teamId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("teams");
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
  await knex.schema.raw("ALTER TABLE userTeams AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("userTeams");
};

module.exports = { up, down }
