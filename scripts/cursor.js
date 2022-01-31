// cursor
function Cursor() {
	this.position = new Point();
	this.size = 0;
}

Cursor.prototype.init = function (size) {
	this.size = size;
};

