const up = async (knex) => {
  await knex.schema.alterTable("coinsReceived", table => {
    table.string("message");
    table.string("type").notNullable();
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

const down = async (knex) => {
  await knex.schema.alterTable("coinsReceived", table => {
    table.dropColumn("message");
    table.dropColumn("type");
    table.dropColumn("createdAt");
  });
};

module.exports = { up, down }
