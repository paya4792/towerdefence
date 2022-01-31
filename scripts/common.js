// - point --------------------------------------------------------------------
function Point(){
	this.x = 0;
	this.y = 0;
}

Point.prototype.distance = function(p){
	var q = new Point();
	q.x = p.x - this.x;
	q.y = p.y - this.y;
	return q;
};

Point.prototype.length = function(){
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Point.prototype.normalize = function(){
	var i = this.length();
	if(i > 0){
		var j = 1 / i;
		this.x *= j;
		this.y *= j;
	}
};

function FloatText(){
	this.position = new Point();

	this.text = "";
	this.size = 0;
	this.color = "";
	this.appear_time = 0;
	this.time = 0;
	this.enable = false;
	this.isMove = false;
}

FloatText.prototype.set = function(pos,text,size,color,time,isMove){
	this.position.x = pos.x;
	this.position.y = pos.y;

	this.text = text;
	this.size = size;
	this.time = 0;
	this.color = color;
	this.appear_time = time;

	this.isMove = isMove;
	this.enable = true;
}

FloatText.prototype.render = function(){
	this.time++;

	if(this.isMove){
		this.position.y--;
	}
	if(this.time > this.appear_time){
		this.enable = false;
	}
}