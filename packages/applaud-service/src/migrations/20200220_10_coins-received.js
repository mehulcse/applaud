const up = async (knex) => {
  if (await knex.schema.hasTable("coinsReceived")) {
    return;
  }
  await knex.schema.createTable("coinsReceived", table => {
    table.increments("id").primary();
    table.integer("balance").notNullable();
    table
      .integer("allocatedToUserId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .integer("allocatedByUserId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .integer("testimonyId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("testimonies");
  });
  await knex.schema.raw("ALTER TABLE coinsReceived AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("coinsReceived");
};

module.exports = { up, down }
