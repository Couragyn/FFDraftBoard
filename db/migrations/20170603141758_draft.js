exports.up = function(knex, Promise) {
  return knex.schema.createTable('draft', function (table) {
    table.increments();
    table.integer('league_id');
    table.string('draft_type');
    table.boolean('rookie');
    table.boolean('unlisted');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('draft');
};

