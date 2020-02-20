const up = async (knex) => {
  if (await knex.schema.hasTable("coinBalance")) {
    return;
  }
  await knex.schema.createTable("coinBalance", table => {
    table.increments("id").primary();
    table.integer("balance").notNullable().defaultTo(20);
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .timestamp("allocatedAt")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
  await knex.schema.raw("ALTER TABLE coinBalance AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("coinBalance");
};

module.exports = { up, down }
