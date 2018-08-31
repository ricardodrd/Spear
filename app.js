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



app.locals.myFunc = function(data){
  console.log("funcion(a)");
  console.log(data)
}


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
app.use('/sala', sala);
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
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(3000, function () {
    debug('Express server listening on port ' + 3000);
});
