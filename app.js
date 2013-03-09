
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
    currentPlayer   : null,
    rows            : 6,
    columns         : 6,
    pieces          : [ { row: 3, column: 2, player : "red" } ]
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

    for( var i = 0; i < board.pieces.length; i++  )  {
        socket.emit( 'new-piece', board.pieces[i] );
    }

    socket.on('request-board', function (data) {
        socket.emit('board',  board );
    });

    socket.on('set-name', function ( name ) {
        socket.playerName = name;
    });

    socket.on('new-piece', function (piece) {

        var minRow = board.rows;

        for( var i = 0 ; i < board.pieces.length; i++ ) {
            if ( board.pieces[i].column = piece.column &&
                 board.pieces[i].row < minRow )
                minRow = board.pieces[i].row;
        }

        piece.row = minRow - 1;
        board.pieces.push( piece );
        io.sockets.emit( 'new-piece', piece );

        var socketClients = io.sockets.clients();

        var currentPlayerIndex = socketClients.length;

        if ( board.currentPlayer === null ) {
            board.currentPlayer = socketClients[0].playerName;
        }

        for ( var i = 0; i < socketClients.length; i++ ) {
            if ( socketClients[ i ].playerName == board.currentPlayer ) {
                currentPlayerIndex = i + 1;
            }
        }
        if ( currentPlayerIndex == socketClients.length )
            currentPlayerIndex = 0;

        board.currentPlayer = socketClients[ currentPlayerIndex ].playerName;

        io.sockets.emit('current-player', board.currentPlayer  );

    });
});
