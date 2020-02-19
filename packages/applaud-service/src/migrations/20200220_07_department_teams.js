const up = async (knex) => {
  if (await knex.schema.hasTable("departmentTeams")) {
    return;
  }
  await knex.schema.createTable("departmentTeams", table => {
    table.increments("id").primary();
    table
      .integer("departmentId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("departments");
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
  await knex.schema.raw("ALTER TABLE departmentTeams AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("departmentTeams");
};

module.exports = { up, down }
