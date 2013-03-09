
/**
 * Module dependencies.
 */

var express = require('express')
  , user = require('./routes/user')
  , http = require('http')
  , _ = require('underscore')
  , path = require('path');

var app = express();

var server      = require('http').createServer(app)
var io          = require('socket.io').listen(server);

var cssClasses  = [
  'jackalope',
  'fennecfox',
  'scorpion',
  'meercat',
  'gilamonster',
  'roadrunner'
];

var board       = {
    currentPlayer   : null,
    rows            : 6,
    columns         : 6,
    pieces          : []
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
        socket.cssClassName = cssClasses.shift();
        cssClasses.push(socket.cssClassName);

        var players = {};
        var socketClients = io.sockets.clients();
        for(var i = 0; i < socketClients.length; i++) {
          players[socketClients[i].playerName] = socketClients[i].cssClassName;
        }
        io.sockets.emit('player-css-classes', players);

        if ( board.currentPlayer == null ) {
            board.currentPlayer = socket.playerName;
            io.sockets.emit('current-player', board.currentPlayer  );
        }
    });

    socket.on('new-piece', function (piece) {
        piece.player = socket.playerName;
        var minRow = board.rows;

        for( var i = 0 ; i < board.pieces.length; i++ ) {
            if ( board.pieces[i].column == piece.column &&
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

        var win = gameComplete();

        if ( win ) {
            io.sockets.emit('winning-player', win  );
            board       = {
                currentPlayer   : null,
                rows            : 6,
                columns         : 6,
                pieces          : []
            };
        }
        else
            io.sockets.emit('current-player', board.currentPlayer  );

    });
});

function gameComplete() {
    var win = false;
    _.each( board.pieces, function( piece ){
        if ( valueOfCell( piece.row, piece.column ) != null &&
             valueOfCell( piece.row + 1, piece.column ) &&
             valueOfCell( piece.row + 2, piece.column ) &&
             valueOfCell( piece.row + 3, piece.column ) )
        win = valueOfCell( piece.row, piece.column );
    });

    _.each( board.pieces, function( piece ){
        if ( valueOfCell( piece.row, piece.column ) != null &&
             valueOfCell( piece.row, piece.column + 1 ) &&
             valueOfCell( piece.row, piece.column + 2 ) &&
             valueOfCell( piece.row, piece.column + 3 ) )
        win = valueOfCell( piece.row, piece.column );
    });

    return win;
}

function valueOfCell( row, column )
{
    var value = null;

    var cell = _.filter( board.pieces, function( piece ){
        return piece.row == row && piece.column == column;
    });

    if ( cell && cell[0] )
        return cell[0].player;

    return null;
}
