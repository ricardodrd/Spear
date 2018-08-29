'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();
var knex = require("../server/dbConnection.js");
/*Home page*/
router.get('/', function (req, res){
  //dbpool.query(recordset, function(err,recordset){
    console.log("Connected...");
    knex.select().from('mediciones').then((resultset)=>{
      res.render('index.ejs',{
      //  news: recordset[0].value;
      data: resultset
      })
      console.log(resultset);
   })

//  })
})
module.exports = router;
