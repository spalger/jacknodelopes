
var board = [
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0]
];

function drawBoard() {

	board.forEach(function(row, cols) {
		var html = '<tr>';
		cols.forEach(function(col, player) {
			html+= '<td class="player-'+player+'"></td>';
		})
		$row
	})
}