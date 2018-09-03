'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();
var knex = require("../server/dbConnection.js");

/*Home page*/
router.get('/', queryDB,createGraph, function (req, res){
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
  var fs = require('fs');
  var d3 = require('d3');
  var JSDOM = require('jsdom').JSDOM;

  var chartWidth = 500,
      chartHeight = 500;

  var arc = d3.arc()
      .outerRadius(chartWidth / 2 - 10)
      .innerRadius(0);

  var colours = ['#F00', '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000'];
 const pieData = [12,31];
 const outputLocation = './views/test.ejs';
      const window = (new JSDOM(`<html><head></head><body></body></html>`, { pretendToBeVisual: true, })).window;
      window.outerHeight = window.innerHeight = 2000;
      window.d3 = d3.select(window.document); //get d3 into the dom

      //do yr normal d3 stuff
      var svg = window.d3.select('body')
          .append('div').attr('class', 'container') //make a container div to ease the saving process
          .append('svg')
          .attr('xmlns', 'http://www.w3.org/2000/svg')
          .attr('width', 'chartWidth')
          .attr('height', 'chartHeight')
          .append('g')
          .attr('transform', 'translate(' + chartWidth / 2 + ',' + chartWidth / 2 + ')');

      svg.selectAll('.arc')
          .data(d3.pie()(pieData))
          .enter()
          .append('path')
          .attr('class', 'arc')
          .attr('d', arc)
          .attr('fill', function(d, i) {
                  return colours[i];
              })
          .attr('stroke', '#fff');

      //write out the children of the container div
      fs.writeFileSync(outputLocation, window.d3.select('.container').html()) //using sync to keep the code simple
next();
  }


module.exports = router;
