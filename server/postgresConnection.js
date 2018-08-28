var knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost'
    user : 'postgres',
    password : '',
    database : 'Spear'
  }
  pool: {min: 0, } 
})

module.exports = knex
