const up = async (knex) => {
  if (await knex.schema.hasTable("userRoles")) {
    return;
  }
  await knex.schema.createTable("userRoles", table => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .string("roleId", 255)
      .notNullable()
      .references("id")
      .inTable("roles");
    table
      .timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.schema.raw("ALTER TABLE userRoles AUTO_INCREMENT=1001");
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists("userRoles");
};

module.exports = { up, down }
