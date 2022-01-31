function Wall() {
    this.xpos = 0;
    this.ypos = 0;
    this.xlength = 0;
    this.ylength = 0;
}

Wall.prototype.init = function (num) {
    switch (num) {
        case 0:
            this.xpos = 0;
            this.ypos = screenCanvas.height / 4 - 5;
            this.xlength = 360;
            this.ylength = 10;
            break;
        case 1:
            this.xpos = 440;
            this.ypos = screenCanvas.height / 4 - 5;
            this.xlength = 360;
            this.ylength = 10;
            break;
        case 2:
            this.xpos = 200;
            this.ypos = screenCanvas.height / 2 - 5;
            this.xlength = 400;
            this.ylength = 10;
            break;
        case 3:
            this.xpos = 0;
            this.ypos = screenCanvas.height / 4 * 3 - 5;
            this.xlength = 360;
            this.ylength = 10;
            break;
        case 4:
            this.xpos = 440;
            this.ypos = screenCanvas.height / 4 * 3 - 5;
            this.xlength = 360;
            this.ylength = 10;
            break;
    }
}

Wall.prototype.checkHit = function(xpos, ypos){
    if(xpos > this.xpos && xpos < this.xpos + this.xlength){
        if(ypos > this.ypos && ypos < this.ypos + this.ylength){
            return true;
        }
    }
    return false;
}