
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , _ = require('underscore')
  , path = require('path');

var app = express();

var server      = require('http').createServer(app)
var io          = require('socket.io').listen(server);

var board       = {
    rows    : 6,
    columns : 6,
    pieces  : []
};

app.configure(function(){
  app.set('port', process.env.PORT || 3000);

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {

    socket.on('request-board', function (data) {
        socket.emit('board',  board );
    });

    socket.on('place-piece', function (data) {
        var minRow = board.rows;

        for( var i = 0 ; board.pieces.length; i++ ) {
            if ( board.pieces[i].column = data.column &&
                 board.pieces[i].row < minRow )
                minRow = board.pieces[i].row;
        }
        data.row = minRow - 1;
        board.pieces.push( data );
    });
});
