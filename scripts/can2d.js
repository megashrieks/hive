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
        ctx[this.mode]();
    }
    point(x, y, size) {
        if (size == undefined) size = 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        this.draw();
        ctx.closePath();
    }
}
