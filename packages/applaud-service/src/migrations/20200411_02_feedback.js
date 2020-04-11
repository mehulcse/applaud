const up = async (knex) => {
  if (await knex.schema.hasTable("feedbacks")) {
    return;
  }
  await knex.schema.createTable("feedbacks", table => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .text("feedback");
    table
      .boolean("isActive")
      .defaultTo(false);
  });
  await knex.schema.raw("ALTER TABLE feedbacks AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("feedbacks");
};

module.exports = { up, down }
