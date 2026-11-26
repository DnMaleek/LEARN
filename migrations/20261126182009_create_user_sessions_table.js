exports.up = function (knex) {
    return knex.schema.createTable("user_sessions", function (table) {
        table.increments("id").primary();

        table
            .integer("user_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.string("session_id", 128).notNullable().unique();

        table.timestamp("expires_at").notNullable();

        table.timestamp("revoked_at").nullable();

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("user_sessions");
};