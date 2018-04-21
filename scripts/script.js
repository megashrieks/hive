var can = document.getElementById("can");
var ctx = can.getContext("2d");

var settings = {
    size: 200,
    timeout: 100
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
            x: ~~(Math.random() * can.width),
            y: ~~(Math.random() * can.height)
        };
        this.target = {
            x: ~~(Math.random() * can.width + size),
            y: ~~(Math.random() * can.height + size)
        };
        this.relaxed = false;
        this.start = {
            x: 0,
            y: 0
        };
        this.end = {
            x: 0,
            y: 0
        };
        this.startMid = 0;
        this.endMid = 0;
    }
    set() {
        this.startMid = 0;
        this.endMid = 0;
    }
    free() {
        var a = this;
        setTimeout(function() {
            a.relaxed = false;
        }, settings.timeout);
    }
    setTarget() {
        var x_diff = global_val.x - this.pos.x;
        var y_diff = global_val.y - this.pos.y;
        if (Math.abs(x_diff) > Math.abs(y_diff)) {
            if (x_diff < 0) this.target.x -= settings.size;
            else this.target.x += settings.size;
        } else {
            if (y_diff < 0) this.target.y -= settings.size;
            else this.target.y += settings.size;
        }
    }
    update() {
        if (this.relaxed) return;
        if (this.endMid <= 1.0) {
            this.end = {
                x: lerp(this.pos.x, this.target.x, this.endMid),
                y: lerp(this.pos.y, this.target.y, this.endMid)
            };
            this.endMid += 0.05;
        } else {
            if (this.startMid <= 1.0) {
                this.start = {
                    x: lerp(this.pos.x, this.target.x, this.startMid),
                    y: lerp(this.pos.y, this.target.y, this.startMid)
                };
                this.startMid += 0.05;
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
            ctx.fillStyle = "rgb(0,255,255)";
            p.point(this.pos, 5);
            ctx.fillStyle = "#000";
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
    for (var i = 0; i < 10; ++i) {
        creatures.push(new Creature());
    }
}
function draw() {
    createGrid();
    p.clear();
    for (var i = 0; i < creatures.length; ++i) {
        creatures[i].update();
        creatures[i].draw();
    }
    requestAnimationFrame(draw);
}
window.onresize = resize;
resize();
setup();
can.onmousemove = function(e) {
    global_val = {
        x: e.clientX,
        y: e.clientY
    };
};
requestAnimationFrame(draw);
