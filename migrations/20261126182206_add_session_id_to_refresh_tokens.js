exports.up = function (knex) {
    return knex.schema.alterTable("refresh_tokens", function (table) {
        table
            .integer("session_id")
            .unsigned()
            .nullable()
            .references("id")
            .inTable("user_sessions")
            .onDelete("CASCADE");

        table.index("session_id");
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable("refresh_tokens", function (table) {
        table.dropIndex("session_id");
        table.dropColumn("session_id");
    });
};