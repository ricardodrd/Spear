'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();

/*Home page*/
router.get('/', function (req, res){
  var recordset = 'SELECT * FROM mediciones';
  //dbpool.query(recordset, function(err,recordset){
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const t = `${h}:${m}:${s}`;
    console.log("Connected...");
    res.render('cocina.ejs',{
    //  news: recordset[0].value;
    title: t,
    time: t
    })

})
module.exports = router;
