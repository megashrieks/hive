class can2d {
    constructor(can) {
        this.can = can;
        this.ctx = can.getContext("2d");
        this.mode = "fill";
    }
    setType(type) {
        this.mode = type;
    }
    draw() {
        this.ctx[this.mode]();
    }
    point(p, size) {
        if (size == undefined) size = 1;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        this.draw();
        this.ctx.closePath();
    }
    line(p1, p2) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.can.width, this.can.height);
    }
}
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
    clone() {
        return {
            x: this.x,
            y: this.y
        };
    }
}
