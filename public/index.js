
var my_player_name;
var player_css_classes;
var board = {
	$: null,
	rows: 6,
	columns: 6,
	pieces: []
};

function drawBoard() {
	var html = '<table>';
	for ( row = 0; row < board.rows; row ++ ) {
		html += '<tr>';
		for ( col = 0; col < board.columns; col ++ ) {
			html += '<td data-col="'+col+'" ></td>';
		}
		html += '</tr>';
	}
	board.$.html(html+'</table>');
	board.pieces.forEach(function(piece){
		addPiece(piece)
	})
}

function addPiece(piece) {
	board.pieces.push(piece);
	// colors
	$cell = $('#board tr:nth('+piece.row+') td:nth('+piece.column+')');
	var position = $cell.position();
	$('<div>')
		.addClass('piece '+player_css_classes[piece.player])
		.appendTo('#board')
		.css({
			left: position.left
		})
		.animate({
			top: position.top
		});
}

$(function() {
    board.$ = $('#board');

	board.$.hide();

	drawBoard();

	$('input[name=player-name]').keyup(function (ev) {
		if (ev.which === 13) {
			my_player_name = this.value;
			$('.player-name').text(my_player_name)
			socket.emit('set-name', my_player_name);
			$(this).remove();
			board.$.show();
			drawBoard();
		}
	});

	board.$.on('click', 'td', function () {
		if (is_my_turn) {
			is_my_turn = false;
			socket.emit('new-piece', { column: $(this).data('col'), player: my_player_name });
		}
	});

	var socket = window.socket = io.connect('http://localhost:3000');

	socket.on('new-piece', function (piece) {
		addPiece(piece);
	});

	socket.on('player-css-classes', function (players) {
		player_css_classes = players;
	});

	socket.on('winning-player', function (winner) {
		board.$.html('<div class="piece '+player_css_classes[winner]+'"></div><h2>'+winner+' won the bloody game!!</h2>');
	})

	socket.on('current-player', function (player) {
		if (player === my_player_name) {
			is_my_turn = true;
			$('#make-your-move').show();
		} else {
			is_my_turn = false;
			$('#make-your-move').hide();
		}
	})
});