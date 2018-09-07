'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();
var knex = require("../server/dbConnection.js");
var JSDOM = require('jsdom').JSDOM;
var fs = require('fs');
var d3 = require('d3');
/*Home page*/
router.get('/',query1, query2, query3, query4, query5, query6, createGraph, render);




function query1(req, res, next){
  const sensorid = 'a7842665-c151-47f5-9e58-cd459925d43d';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying arcon n4");
    req.dbarconn4 = resultset.rows;
    next();
  })
};
function query2(req, res, next){
  const sensorid = '6ba38a42-5b88-46fe-ad31-6b01a4843fce';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying nevera alta n2");
    req.dbneveran2 = resultset.rows;
    next();
  })
};
function query3(req, res, next){
  const sensorid = '09c46480-ed13-47d7-a466-9b0f3c694f17';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying nevera alta n1");
    req.dbnevern1 = resultset.rows;
    next();
  })
};
function query4(req, res, next){
  const sensorid = 'db35d0a8-2628-49c2-9238-fe670c8e85a0';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying arcon n2");
    req.dbarconn2 = resultset.rows;
    next();
  })
};
function query5(req, res, next){
  const sensorid = 'bd7764aa-41a6-4ae9-a512-f7dcafe374ff';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying arcon n1");
    req.dbarconn1 = resultset.rows;
    next();
  })
};
function query6(req, res, next){
  const sensorid = 'd41dd2a1-ee27-43bf-950c-ef1510d8c4df';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying arcon n3");
    req.dbarconn3 = resultset.rows;
    next();
  })
};


function createGraph(req, res, next){
  const arconn1 = req.dbarconn1;
  const arconn2 = req.dbarconn2;
  const arconn3 = req.dbarconn3;
  const arconn4 = req.dbarconn4;
  const neveran1 = req.dbnevern1;
  const neveran2 = req.dbneveran2;

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
------------------------------------------------
PARSER
-----------------------------------------------*/

var parset = d3.timeParse("%H:%M:%S");
var d = parset("00:00:01");
var n = parset("23:59:59");

var max = 0;
for (var index in arconn1){
  arconn1[index].date = parset(arconn1[index].date);
  if(arconn1[index].value>max){
    max = arconn1[index].value;
  }
}
for (var index in arconn2){
  arconn2[index].date = parset(arconn2[index].date);
  if(arconn2[index].value>max){
    max = arconn2[index].value;
  }
}
for (var index in arconn3){
  arconn3[index].date = parset(arconn3[index].date);
  if(arconn3[index].value>max){
    max = arconn3[index].value;
  }
}
for (var index in arconn4){
  arconn4[index].date = parset(arconn4[index].date);
  if(arconn4[index].value>max){
    max = arconn4[index].value;
  }
}
for (var index in neveran1){
  neveran1[index].date = parset(neveran1[index].date);
  if(neveran1[index].value>max){
    max = neveran1[index].value;
  }
}
for (var index in neveran2){
  neveran2[index].date = parset(neveran2[index].date);
  if(neveran2[index].value>max){
    max = neveran2[index].value;
  }
}

console.log(max);


var xScale = d3.scaleTime()
  .domain([d,n])
  .range([0, width-margin]);
var yScale = d3.scaleLinear()
  .domain([0, max+10])
  .range([height-margin, 0]);
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var xAxis = d3.axisBottom(xScale).ticks(24);
  var yAxis = d3.axisLeft(yScale).ticks(10);

const outputLocation = './views/jsdomaltillo.ejs';
     const window = (new JSDOM(`
       <html>
       <head>
       </head>
       <body>
       </body>
       </html>`, { pretendToBeVisual: true, })).window;
       window.d3 = d3.select(window.document); //get d3 into the dom
var svg = window.d3.select('body')
 .append('div').attr('class', 'container') //make a container div to ease the saving process
 .append('svg')
 .attr('xmlns', 'http://www.w3.org/2000/svg')
 .attr('width', width)
 .attr('height', height)
 .append('g')
 .attr('transform', 'translate(' + width / 20 + ',' + height / 15 + ')');

 let lines = svg.append('g')
     .attr('class', 'lines');


let line = d3.line()
  .x(d=> xScale(d.date))
  .y(d => yScale(d.value))
  .curve(d3.curveMonotoneX);




  /*
  ---------------------------------------------------
  GROUP 2
  ---------------------------------------------------
  */
lines.selectAll('.line')
  .data(arconn1).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line28')
  .attr('d', line(arconn1))
  .style('stroke',  i => color(i))
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);

lines.selectAll('.line-gourp')
  .data(arconn2).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line')
  .attr('d', line(arconn2))
  .style('stroke', '#339E6D')
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);

lines.selectAll('.line-gourp')
  .data(arconn3).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line')
  .attr('d', line(arconn3))
  .style('stroke', '#E55839')
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);
lines.selectAll('.line-gourp')
  .data(arconn4).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line')
  .attr('d', line(arconn4))
  .style('stroke', '#2EEECA')
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);
lines.selectAll('.line-gourp')
  .data(neveran1).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line')
  .attr('d', line(neveran1))
  .style('stroke', '#8B2B98')
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);
lines.selectAll('.line-gourp')
  .data(neveran2).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line')
  .attr('d', line(neveran2))
  .style('stroke', '#9AA111')
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);
  /*
------------------------------------------
                  CIRCLES
------------------------------------------
  */
//   lines.selectAll("circle-group")
//     .data(arconn1).enter()
//     .append("g")
//     .style("fill", i => color(i+1))
//     .selectAll("circle")
//     .data(arconn1,d => d.value).enter()
//     .append("g")
//     .attr("class", "circle")
//     .append("circle")
//     .attr("cx",arconn1=> xScale(arconn1.date))
//     .attr("cy",arconn1=> yScale(arconn1.value))
//     .attr("r", 1)
//     .style('opacity', circleOpacity);
// lines.selectAll("circle-group")
//   .data(arconn2).enter()
//   .append("g")
//   .style("fill", '#E3F85F')
//   .selectAll("circle")
//   .data(arconn2,d => d.value).enter()
//   .append("g")
//   .attr("class", "circle")
//   .append("circle")
//   .attr("cx",arconn2=> xScale(arconn2.date))
//   .attr("cy",arconn2=> yScale(arconn2.value))
//   .attr("r", 1)
//   .style('opacity', circleOpacity);
// lines.selectAll("circle-group")
//   .data(arconn3).enter()
//   .append("g")
//   .style("fill", '#E55839')
//   .selectAll("circle")
//   .data(arconn3,d => d.value).enter()
//   .append("g")
//   .attr("class", "circle")
//   .append("circle")
//   .attr("cx",arconn3=> xScale(arconn3.date))
//   .attr("cy",arconn3=> yScale(arconn3.value))
//   .attr("r", 1)
//   .style('opacity', circleOpacity);


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
  fs.writeFileSync(outputLocation, window.d3.select('.container').html()) //using sync to keep the code simple

  next();
}











function render(req, res, next){
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const t = `${h}:${m}:${s}`;
  console.log("Connected...");
  res.render('altillo.ejs',{
  title: "sd",
  time: t
    })
}


module.exports = router;
