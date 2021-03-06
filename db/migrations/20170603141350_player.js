exports.up = function(knex, Promise) {
  return knex.schema.createTable('player', function (table) {
    table.increments();
    table.string('name');
    table.string('position');
    table.string('team');
    table.boolean('rookie');
    table.integer('std_adp');
    table.integer('idp_adp');
    table.integer('ppr_adp');
    table.integer('position_adp');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('player');
};
