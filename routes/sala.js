'use strict'
//var dbpool = require("../server/mysqlLib.js");
var express = require('express');
var router = express.Router({mergeParams:true});
var knex = require("../server/dbConnection.js");
var JSDOM = require('jsdom').JSDOM;
var fs = require('fs');
var d3 = require('d3');



router.get('/', queryAire1, queryhumedad, createGraph, render);



router.get('/iluminacion',queryAire1, queryIluminacion, createGraph, render);


// router.get('/temperatura',function(req,res,next){
//   console.log("hola");
// });


function queryhumedad(res, req, next){
  const sensorid = 'c4adf0d8-fba2-4586-89ab-0bdf38301fe5';
  console.log("made it the other way");
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying humedad");
    req.dbdata = resultset.rows;
    next();
  })
};

function queryAire1 (res, req, next){
  const sensorid = '58b43d93-0ef2-4715-98e9-ce17ca5340dd';
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying Aire");
    req.dbdata1 = resultset.rows;
    console.log(req.dbdata1);
    next();
  })
};
function queryIluminacion(req, res, next){
  const sensorid = 'aee078b0-bf3a-4161-b661-3481f67feac0';
console.log("made it the other way");
  knex.raw(`SELECT TO_CHAR(date,'HH24:MI:SS') as date,value from mediciones where sensorid='${sensorid}' AND TO_CHAR(date,'yyyy-mm-dd')= '2018-09-03'`).then((resultset)=>{
    console.log("querying iluminacion");
    res.dbdata = resultset.rows;
    next();
  })
}
function testing(res, req, next){
  console.log("hellooooooooooooooooooooooooooo");
  if(!req.dbdata){
    console.log("res");
  }
  else{
    console.log("req");
  }
  if(!req.dbdata1){
    console.log("res1");
  }
  else{
    console.log("req1");
  }

}


//ejs needs to be fetched before using D3 json

function createGraph (res, req, next){
const data = req.dbdata;
const data1 = req.dbdata1;
//req not constant

  console.log(data1);

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

for (var index in data){
  data[index].date = parset(data[index].date);
}
for (var index1 in data1){
  data1[index1].date = parset(data1[index1].date);
}





var xScale = d3.scaleTime()
  .domain([d,n])
  .range([0, width-margin]);
var yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value )])
  .range([height-margin, 0]);
var nyScale =  d3.scaleLinear()
  .domain([0, d3.max(data1, d => d.value)])
  .range([height-margin, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);
var xAxis = d3.axisBottom(xScale).ticks(24);
var yAxis = d3.axisLeft(yScale).ticks(10);
var nyAxis = d3.axisRight(nyScale).ticks(15);






 const outputLocation = './views/jsdomsala.ejs';
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
let line2 = d3.line()
  .x(d=>xScale(d.date))
  .y(d => nyScale(d.value));




/*
---------------------------------------------------
GROUP 2
---------------------------------------------------
*/
lines.selectAll('.line')
  .data(data1).enter()
  .append('g')
  .attr('class', 'line')
  .append('path')
  .attr('class', 'line28')
  .attr('d', line2(data1))
  .style('stroke',  i => color(i+3))
  .style('opacity', 0.5)
  .style("stroke-width", 1.5);

/*
---------------------------------------------------
                  GROUP 1 lines
---------------------------------------------------
*/


/*Humedad*/
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
  .style('stroke',  i => color(i))
  .style('opacity', lineOpacity)
  .style("stroke-width", 2)
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

/*
----------------------------------------------------
                  Circles
----------------------------------------------------
*/



/*Humedad*/
lines.selectAll("circle-group")
  .data(data).enter()
  .append("g")
  .style("fill", i => color(i+3))
  .selectAll("circle")
  .data(data,d => d.value).enter()
  .append("g")
  .attr("class", "circle")
  .on("mouseover", function(d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`hello`)
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
  .attr("r", 2)
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




lines.selectAll("circle-group")
  .data(data1).enter()
  .append("g")
  .style("fill", i => color(i+1))
  .selectAll("circle")
  .data(data1,d => d.value).enter()
  .append("g")
  .attr("class", "circle")
  .on("mouseover", function(d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`hello`)
        .attr("x", xScale(d.date) + 5)
        .attr("y", nyScale(d.value) - 10);
    })
  .on("mouseout", function(d) {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(duration)
        .selectAll(".text").remove();
    })
  .append("circle")
  .attr("cx",data1=> xScale(data1.date))
  .attr("cy",data1=> nyScale(data1.value))
  .attr("r", 1)
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

/*
--------------------------------------------------------
                      AXIS
--------------------------------------------------------
*/

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
  .text("%")
  .attr("transform","translate(-15,-20)")
svg.append("g")
    .attr("class", "y axis")
    .attr("transform","translate("+axistransform1+",0)")
    .call(nyAxis)
    .append('text')
    .attr("y", 15)
    .attr("fill", "green")
    .text("Wh")
    .attr("transform","translate(-15,-25)");


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
