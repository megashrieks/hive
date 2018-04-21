var can = document.getElementById("can");
var ctx = can.getContext("2d");

var settings = {
    size: 30,
    timeout: 100,
    creatures: 1000
};
var global_val = {
    x: ~~(can.width / 2),
    y: ~~(can.height / 2)
};
var creatures = [];

var p = new can2d(can);
function lerp(a, b, m) {
    return (1 - m) * a + m * b;
}
class Creature {
    constructor() {
        var size = settings.size;
        this.pos = {
            x: ~~(Math.random() * can.width / size),
            y: ~~(Math.random() * can.height / size)
        };
        this.target = {
            x: this.pos.x,
            y: this.pos.y
        };
        this.relaxed = false;
        this.start = {
            x: this.pos.x * size,
            y: this.pos.y * size
        };
        this.end = {
            x: this.pos.x * size,
            y: this.pos.y * size
        };
        this.startMid = 0;
        this.endMid = 0;
        this.timeout = Math.random() * 2000
    }
    set() {
        this.startMid = 0;
        this.endMid = 0;
    }
    free() {
        var a = this;
        setTimeout(function () {
            a.relaxed = false;
        }, this.timeout);
    }
    setTarget() {
        var x_diff = ~~(global_val.x / settings.size) - this.pos.x;
        var y_diff = ~~(global_val.y / settings.size) - this.pos.y;
        if (Math.abs(x_diff) > Math.abs(y_diff)) {
            if (x_diff < 0) this.target.x -= 1;
            else this.target.x += 1;
        } else {
            if (y_diff < 0) this.target.y -= 1;
            else this.target.y += 1;
        }
    }
    update() {
        if (this.relaxed) return;
        if (this.endMid < 1.0) {
            this.end = {
                x: lerp(
                    this.pos.x * settings.size,
                    this.target.x * settings.size,
                    this.endMid
                ),
                y: lerp(
                    this.pos.y * settings.size,
                    this.target.y * settings.size,
                    this.endMid
                )
            };
            this.endMid += 0.1;
        } else {
            if (this.startMid < 1.0) {
                this.start = {
                    x: lerp(
                        this.pos.x * settings.size,
                        this.target.x * settings.size,
                        this.startMid
                    ),
                    y: lerp(
                        this.pos.y * settings.size,
                        this.target.y * settings.size,
                        this.startMid
                    )
                };
                this.startMid += 0.1;
            } else {
                this.relaxed = true;
                this.pos = Object.assign({}, this.target);
                this.set();
                this.free();
                this.setTarget();
            }
        }
    }
    draw() {
        if (this.relaxed) {
            p.setType("stroke");
            ctx.strokeStyle = "rgb(0,0,0)";
            // p.point({
            //     x: this.pos.x * settings.size,
            //     y: this.pos.y * settings.size
            // }, 3);
            ctx.strokeStyle = "#000";
        } else {
            p.line(this.start, this.end);
        }
    }
}

function createGrid() {
    var size = settings.size;
    ctx.fillStyle = "#000";
    for (var i = 0; i < can.width; i += size) {
        for (var j = 0; j < can.height; j += size) {
            var v = new Vector(i, j);
            p.point(v, 2);
        }
    }
}
function resize() {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
    global_val = {
        x: can.width / 2,
        y: can.height / 2
    };
}
function setup() {
    creatures = [];
    for (var i = 0; i < settings.creatures; ++i) {
        creatures.push(new Creature());
    }
}
function draw() {
    p.clear();
    // createGrid();
    for (var i = 0; i < creatures.length; ++i) {
        creatures[i].update();
        creatures[i].draw();
    }
    requestAnimationFrame(draw);
}
window.onresize = resize;
resize();
setup();
can.onmousemove = function (e) {
    global_val = {
        x: e.clientX,
        y: e.clientY
    };
};
requestAnimationFrame(draw);
