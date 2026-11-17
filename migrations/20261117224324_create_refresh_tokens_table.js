exports.up = function (knex) {
    return knex.schema.createTable("refresh_tokens", (table) => {

        table.increments("id").primary();

        table.integer("user_id")
            .unsigned()
            .notNullable();

        table.string("token_hash", 255)
            .notNullable()
            .unique();

        table.timestamp("expires_at").notNullable();

        table.timestamp("revoked_at").nullable();

        table.timestamps(true, true);

        table.foreign("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("refresh_tokens");
};