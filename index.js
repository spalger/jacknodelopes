
var my_player_name = 'spencer';
var board = {
	columns : 5,
	rows : 8,
	pieces : [ {
		row: 5,
		column: 3,
		player: "spencer"
	} ]
};

function drawBoard() {
	var rows, cols, html = "<table>";
	for ( row = 0; row < board.rows; row ++ ) {
		html += "<tr>";
		for ( col = 0; col < board.columns; col ++ ) {
			html += "<td></td>";
		}
		html += "</tr>";
	}
	$('#board').html(html+"</table>");
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
	$('#board').on('click', 'td', function() {
		var x = $(this).data('x');
		var y = $(this).data('y');
	})
})

