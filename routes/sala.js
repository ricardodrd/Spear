'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();

/*Home page*/
router.get('/', function (req, res){
  var recordset = 'SELECT * FROM mediciones';
  //dbpool.query(recordset, function(err,recordset){
    console.log("Connected...");
    res.render('sala.ejs',{
    //  news: recordset[0].value;
    title: "sd"
    })
//  })
})
module.exports = router;
