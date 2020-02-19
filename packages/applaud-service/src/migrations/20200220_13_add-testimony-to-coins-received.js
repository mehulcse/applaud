const up = async (knex) => {
  await knex.schema.alterTable("coinsReceived", table => {
    table.string("message");
    table.string("type").notNullable();
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.fn.now());
    table.dropForeign(["testimonyId"]);
    table.dropColumn("testimonyId");
  });
};

const down = async (knex) => {
  await knex.schema.alterTable("coinsReceived", table => {
    table.dropColumn("message");
    table.dropColumn("type");
    table.dropColumn("createdAt");
    table
      .integer("testimonyId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("testimonies");
  });
};

module.exports = { up, down }
