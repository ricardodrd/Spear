'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();
var knex = require("../server/dbConnection.js");

/*Home page*/
router.get('/', queryDB, function (req, res){
  //dbpool.query(recordset, function(err,recordset){
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const t = `${h}:${m}:${s}`;
  console.log("Connected...");
  res.render('sala.ejs',{
    //  news: recordset[0].value;
    title: "sala",
    data: res.dbdata,
    time: t
  })
});

function queryDB(res, req, next){
  knex.select('sensorid', 'value').from('mediciones').then((resultset)=>{
    console.log("querying information");
    req.dbdata = resultset;
    next();
  })
}
//ejs needs to be fetched before using D3 json

function createGraph (res, req, next){
  console.log(req.dbdata);

}
module.exports = router;
