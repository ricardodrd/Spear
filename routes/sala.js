'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();
var knex = require("../server/dbConnection.js");
var JSDOM = require('jsdom').JSDOM;
var fs = require('fs');
var d3 = require('d3');



/*Home page*/
router.get('/', queryDB,createGraph, render);

function queryDB(res, req, next){
  const sensorid = 'c4adf0d8-fba2-4586-89ab-0bdf38301fe5'
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying information");
    req.dbdata = resultset.rows;
    next();
  })
}
//ejs needs to be fetched before using D3 json

function createGraph (res, req, next){
  console.log("here")
  const data = req.dbdata;
  console.log(data);

  // const si = Object.keys(data).length;
  // console.log(data[0].date);
  // console.log(typeof(data[si-1].date));


  /* -
  ------------------------------------------*/
  var width = 1000;
  var height = 450;
  var margin = 90;
  var mar2 = 80;
  var duration = 250;

  var lineOpacity = "0.25";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "4px";
  var lineStrokeHover = "4.5px";

  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 3;
  var circleRadiusHover = 6;
  var axistransform1=width-margin;
  var axistransform2=axistransform1+40;

/*
-----------------------------------------------*/
var parset = d3.timeParse("%H:%M:%S");
var d = parset("00:00:01");

var n = parset("23:59:59");
var forma = d3.timeFormat("%H:%M:%S");

for (var index in data){
  data[index].date = parset(data[index].date);
}
  var chartWidth = 500,
      chartHeight = 800;




  var xScale = d3.scaleTime()
    .domain([d,n])
    .range([0, width-margin]);
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value )])
    .range([height-margin, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var xAxis = d3.axisBottom(xScale).ticks(24);
  var yAxis = d3.axisLeft(yScale).ticks(25);


/*-----------------------------------------------------
            PIE CHART
---------------------------------------------------

  //
  // var arc = d3.arc()
  //     .outerRadius(chartWidth / 2 - 10)
  //     .innerRadius(0);
 //  var colours = ['#F00', '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000'];
 // const pieData = [12,31];

 //
 // svg.selectAll('.arc')
 //     .data(d3.pie()(pieData))
 //     .enter()
 //     .append('path')
 //     .attr('class', 'arc')
 //     .attr('d', arc)
 //     .attr('fill', function(d, i) {
 //             return colours[i];
 //         })
 //     .attr('stroke', '#fff');


/*
----------------------------------------------------------*/

 const outputLocation = './views/test.ejs';
      const window = (new JSDOM(`
        <html>
        <head>
        </head>
        <body>
        </body>
        </html>`, { pretendToBeVisual: true, })).window;
      window.d3 = d3.select(window.document); //get d3 into the dom


      // //do yr normal d3 stuff
      var svg = window.d3.select('body')
        .append('div').attr('class', 'container') //make a container div to ease the saving process
        .append('svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', 'chartWidth')
        .attr('height', 'chartHeight')
        .append('g')
        .attr('transform', 'translate(' + chartWidth / 8 + ',' + chartWidth / 4 + ')');
        let lines = svg.append('g')
            .attr('class', 'lines');
        let line = d3.line()
            .x(d=> xScale(d.date))
            .y(d => yScale(d.value));
            console.log("sssss");
            console.log(data);
            lines.selectAll('.line-group')
              .data(data).enter()
              .append('g')
              .attr('class', 'line-group')
              .on("mouseover", function(d, i) {
                  svg.append("text")
                    .attr("class", "title-text")
                    .style("fill", color(i))
                    .text(d.name)
                    .attr("text-anchor", "middle")
                    .attr("x", (width-margin)/2)
                    .attr("y", -15);
              })
              .on("mouseout", function(d) {
                  svg.select(".title-text").remove();
              })
              .append('path')
              .attr('class', 'line')
              .attr('d', line(data))
              .style('stroke', (d, i) => color(i))
              .style('opacity', lineOpacity)
              .style("stroke-width", lineStroke)
              .on("mouseover", function(d) {
                  d3.selectAll('.line')
            					.style('opacity', otherLinesOpacityHover);
                  d3.selectAll('.circle')
            					.style('opacity', circleOpacityOnLineHover);
                  d3.select(this)
                    .style('opacity', lineOpacityHover)
                    .style("stroke-width", lineStrokeHover)
                    .style("cursor", "pointer");
                })
              .on("mouseout", function(d) {
                  d3.selectAll(".line")
            					.style('opacity', lineOpacity);
                  d3.selectAll('.circle')
            					.style('opacity', circleOpacity);
                  d3.select(this)
                    .style("stroke-width", lineStroke)
                    .style("cursor", "none");
              });
            lines.selectAll("circle-group")
              .data(data).enter()
              .append("g")
              .style("fill", (d, i) => color(i))
              .selectAll("circle")
              .data(data,d => d.value).enter()
              .append("g")
              .attr("class", "circle")
              .on("mouseover", function(d) {
                  d3.select(this)
                    .style("cursor", "pointer")
                    .append("text")
                    .attr("class", "text")
                    .text(`${d.value}`)
                    .attr("x", xScale(d.date) + 5)
                    .attr("y", yScale(d.value) - 10);
                })
              .on("mouseout", function(d) {
                  d3.select(this)
                    .style("cursor", "none")
                    .transition()
                    .duration(duration)
                    .selectAll(".text").remove();
                })
              .append("circle")
              .attr("cx",data => xScale(data.date))
              .attr("cy",data=> yScale(data.value))
              .attr("r", circleRadius)
              .style('opacity', circleOpacity)
              .on("mouseover", function(d) {
                    d3.select(this)
                      .transition()
                      .duration(duration)
                      .attr("r", circleRadiusHover);
                  })
                .on("mouseout", function(d) {
                    d3.select(this)
                      .transition()
                      .duration(duration)
                      .attr("r", circleRadius);
            });




      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height-margin})`)
        .call(xAxis);
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append('text')
        .attr("y", 15)
        .attr("x",20)
        .attr("fill", "#000")
        .text("Wh")
        .attr("transform","translate(-15,-20)")


      /* ALTILLO SVG */

      //write out the children of the container div
      fs.writeFileSync(outputLocation, window.d3.select('.container').html()) //using sync to keep the code simple
next();
  }
  function render(req, res){
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
  }


module.exports = router;
