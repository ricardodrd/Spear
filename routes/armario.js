'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router();
var knex = require("../server/dbConnection.js");
var JSDOM = require('jsdom').JSDOM;
var fs = require('fs');
var d3 = require('d3');

router.get('/', query1, query2, query3, query4, query5, query6, createGraph,render);


function query1(req, res, next){
  const sensorid = '58b43d93-0ef2-4715-98e9-ce17ca5340dd';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying aire1");
    req.dbaire1 = resultset.rows;
    next();
  })
};
function query2(req, res, next){
  const sensorid = '1e9bf808-3875-4c17-b5fd-7ce396c1c7dd';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying aire2");
    req.dbaire2 = resultset.rows;
    next();
  })
};
function query3(req, res, next){
  const sensorid = '58b43d93-0ef2-4715-98e9-ce17ca5340dd';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying aire3");
    req.dbaire3 = resultset.rows;
    next();
  })
};
function query4(req, res, next){
  const sensorid = 'eba2b2d7-2d9c-4963-bea1-9ad4ed4101e6';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying horno");
    req.dbhorno = resultset.rows;
    next();
  })
};
function query5(req, res, next){
  const sensorid = 'b2149781-47d2-4466-bbf7-00fdf4978add';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying cafetera");
    req.dbcafetera = resultset.rows;

    next();
  })
};
function query6(req, res, next){
  const sensorid = '493bd759-964b-431c-8177-0cf347f10f1e';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying general");
    req.dbgeneral = resultset.rows;
    next();
  })
};





function createGraph(req, res, next){
const aire1 = req.dbaire1;
const aire2 = req.dbaire2;
const aire3 = req.dbaire3;
const horno = req.dbhorno;
const cafetera = req.dbcafetera;
const general = req.general;
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


for (var index in aire1){
  aire1[index].date = parset(aire1[index].date);
  if(aire1[index].value>max){
    max = aire1[index].value;
  }
}
for (var index in aire2){
  aire2[index].date = parset(aire2[index].date);
  if(aire2[index].value>max){
    max = aire2[index].value;
  }
}
for (var index in aire3){
  aire3[index].date = parset(aire3[index].date);
  if(aire3[index].value>max){
    max = aire3[index].value;
  }
}
for (var index in horno){
  horno[index].date = parset(horno[index].date);
  if(horno[index].value>max){
    max = horno[index].value;
  }
}
for (var index in cafetera){
  cafetera[index].date = parset(cafetera[index].date);
  if(cafetera[index].value>max){
    max = cafetera[index].value;
  }
}
for (var index in general){
  general[index].date = parset(general[index].date);
  if(general[index].value>max){
    max = general[index].value;
  }
}
var xScale = d3.scaleTime()
  .domain([d,n])
  .range([0, width-margin]);
var yScale = d3.scaleLinear()
  .domain([0, max+10])
  .range([height-margin, 0]);
var color = d3.scaleOrdinal(d3.schemeCategory10);
var xAxis = d3.axisBottom(xScale).ticks(24);
var yAxis = d3.axisLeft(yScale).ticks(10);

const outputLocation = './views/jsdomarmario.ejs';
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
 .y(d => yScale(d.value));



   /*
   ---------------------------------------------------
   GROUP 2
   ---------------------------------------------------
   */
lines.selectAll('.line')
   .data(aire1).enter()
   .append('g')
   .attr('class', 'line')
   .append('path')
   .attr('class', 'line28')
   .attr('d', line(aire1))
   .style('stroke',  i => color(i))
   .style('opacity', 0.5)
   .style("stroke-width", 1.5);

lines.selectAll('.line')
  .data(aire2).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line28')
  .attr('d', line(aire2))
  .style('stroke', '#339E6D')
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);

lines.selectAll('.line-gourp')
  .data(aire3).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line')
  .attr('d', line(aire3))
  .style('stroke', '#E55839')
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);
lines.selectAll('.line-gourp')
  .data(horno).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line')
  .attr('d', line(horno))
  .style('stroke', '#2EEECA')
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);
lines.selectAll('.line-gourp')
  .data(cafetera).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line')
  .attr('d', line(cafetera))
  .style('stroke', '#8B2B98')
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);



 /*
------------------------------------------
                 CIRCLES
------------------------------------------
 */
//   lines.selectAll("circle-group")
//     .data(aire1).enter()
//     .append("g")
//     .style("fill", i => color(i+1))
//     .selectAll("circle")
//     .data(aire1,d => d.value).enter()
//     .append("g")
//     .attr("class", "circle")
//     .append("circle")
//     .attr("cx",aire1=> xScale(aire1.date))
//     .attr("cy",aire1=> yScale(aire1.value))
//     .attr("r", 1)
//     .style('opacity', circleOpacity);



/*
-------------------------------------------
AXIS
-------------------------------------------*/
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











function render(req, res){
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const t = `${h}:${m}:${s}`;
    console.log("Connected...");
    res.render('armario.ejs',{
    title: "sd",
    time: t
    })
}
module.exports = router;
