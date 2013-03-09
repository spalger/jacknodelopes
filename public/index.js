
var my_player_name;
var board = {
	rows: 6,
	cols: 6,
	pieces: []
};

function drawBoard() {
	var rows, cols, html = '<table>';
	for ( row = 0; row < board.rows; row ++ ) {
		html += '<tr>';
		for ( col = 0; col < board.columns; col ++ ) {
			html += '<td data-col="'+col+'" ></td>';
		}
		html += '</tr>';
	}
	$('#board').html(html+'</table>');
	board.pieces.forEach(function(piece){
		addPiece(piece)
	})
}

function addPiece(piece) {
	board.pieces.push();
	// colors
	$cell = $('#board tr:nth('+piece.row+') td:nth('+piece.column+')');
	var position = $cell.position();
	$('<div>')
		.addClass('piece player '+piece.player)
		.appendTo('#board')
		.css({
			left: position.left
		})
		.animate({
			top: position.top
		});
}

$(function() {

	$('input[name=player-name]').change(function() {
		my_player_name = this.value;
	});

	$('#board').on('click', 'td', function() {
		socket.emit('new-column', { column: $(this).data('col'), player: my_player_name });
	});

	var socket = io.connect('http://localhost:3000');

	socket.on('new-piece', function (piece) {
		addPiece(piece);
	});
});