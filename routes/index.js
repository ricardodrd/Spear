'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();
var knex = require("../server/dbConnection.js");

/*Home page*/

router.get('/', queryDB, function (req, res){
  //dbpool.query(recordset, function(err,recordset){
    console.log("Connected...");
    res.render('index.ejs',{
        //  news: recordset[0].value;
        data: res.dbdata
    })
    console.log(typeof(res.dbdata));


})

function queryDB(res, req, next){
  knex.select().from('mediciones').then((resultset)=>{
    console.log("querying information");
    req.dbdata = resultset;
    next();
  })
}

module.exports = router;
