var debug = require('debug');
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//Config
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





//routes
var cocina = require('./routes/cocina');
var sala = require('./routes/sala');
var altillo = require('./routes/altillo');
var armario = require('./routes/armario');
var routes = require('./routes/index.js');
//var users = require('./routes/users');


app.use('/', routes);
// app.use('/users', users);
app.use('/cocina', cocina);
app.use('/sala',function(req, res, next){
  console.log(req.originalUrl); // '/admin/new'
console.log(req.baseUrl); // '/admin'
console.log(req.path); // '/new'
next();
}, sala);
app.use('/altillo', altillo);
app.use('/armario', armario);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function (err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }



/*


*/


// production error handler
// no stacktraces leaked to user
// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });
app.locals.myFunc = function(data){
  var d3 = require("d3");
  console.log("funcion(a)");
  console.log(data);
  const d = data;
  var width = 1000;
  var height = 450;
  var margin = 90;
  var mar2 = 80;
  var duration = 250;

  var axistransform1=width-margin;
  var axistransform2=axistransform1+40;
  var xScale = d3.scaleTime()
    .domain([0,350])
    .range([0, width-margin]);
  var yScale_cocina= d3.scaleLinear()
    .domain([0, 350])
    .range([height-margin, 0]);
  var nyScale_cocina =  d3.scaleLinear()
    .domain([0, 100])
    .range([height-margin, 0])

  var xAxis = d3.axisBottom(xScale).ticks(24);
  var yAxis_cocina = d3.axisLeft(yScale_cocina).ticks(25);
  var nyAxis_cocina= d3.axisRight(nyScale_cocina).ticks(15);

  var chartposY = d3.select("#chartpost").append("svg")
    .attr("width", (width+margin)+"px")
    .attr("height", (height+margin)+"px")
    .append('g')
    .attr("transform", `translate(${mar2}, ${mar2})`);

  // chartpost.append("g")
  //     .attr("class", "2x axis")
  //     .attr("transform", `translate(0, ${height-margin})`)
  //     .call(xAxis);
  // chartpost.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis_cocina)
  //     .append('text')
  //     .attr("y", 15)
  //     .attr("x",20)
  //     .attr("fill", "#000")
  //     .text("Wh")
  //     .attr("transform","translate(-15,-20)");
  // chartpost.append("g")
  //     .attr("class", "y axis")
  //     .attr("transform","translate("+axistransform1+",0)")
  //     .call(nyAxis_cocina)
  //     .append('text')
  //     .attr("y", 15)
  //     .attr("fill", "#000")
  //     .text("Mediciones")
  //     .attr("transform","translate(-10,-25)");




}

app.listen(3000, function () {
    debug('Express server listening on port ' + 3000);
});
