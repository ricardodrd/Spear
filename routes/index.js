'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();
var knex = require("../server/dbConnection.js");

/*Home page*/

router.get('/', queryDB, function (req, res){
  //dbpool.query(recordset, function(err,recordset){
    console.log("Connected...");
    knex.select().from('mediciones').then((resultset)=>{
      res.render('index.ejs',{
      //  news: recordset[0].value;
      data: resultset

      })
      console.log(typeof(resultset));
      console.log(res.dbdata);
   })

//  })
})

function queryDB(res, req, next){
  console.log("quer information");
  req.dbdata = "dataaaaa";
  next();
}

module.exports = router;
