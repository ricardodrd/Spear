'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();
var knex = require("../server/dbConnection.js");

/*Home page*/
router.get('/', queryDB, function (req, res){
  //dbpool.query(recordset, function(err,recordset){
    console.log("Connected...");
    res.render('sala.ejs',{
    //  news: recordset[0].value;
      title: "sd",
      data: res.dbdata
    })
    // console.log(res.dbdata);
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
/*
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

  var y = d3.scale.linear().range([height, 0]);

  // define the axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")


  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);


  // add the SVG element
  var svg = d3.select("#chart7").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
 const data = req.dbdata;
            data.forEach(function(d) {
      d.sensorid = d.sensorid;
      d.value = +d.value;
  });

// scale the range of the data
x.domain(data.map(function(d) { return d.sensorid; }));
y.domain([0, d3.max(data, function(d) { return d.value; })]);

// add axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)" );

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");


// Add bar chart
svg.selectAll("bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.sensorid); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); });
*/
}
module.exports = router;
