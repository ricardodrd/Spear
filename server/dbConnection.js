var knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost',
    user : 'postgres',
    password : '978be06528',
    database : 'Spear',
    debug: true,
    asyncStackTraces: true

  }
});

module.exports = knex;
