var can = document.getElementById("can");
var ctx = can.getContext("2d");

var settings = {
    size: 10,
    creatures: 100,
    lerp: 0.1,
    grid: false,
    showGrid: false,
    showRelaxed: true
};
var settings_copy = {};
var global_val = {
    x: ~~(can.width / 2),
    y: ~~(can.height / 2)
};
var creatures = [];
var grid = [];
var p = new can2d(can);

function lerp(a, b, m) {
    return (1 - m) * a + m * b;
}
function get_free_space(obj) {
    if (obj.x - 1 >= 0 && grid[obj.x - 1][obj.y] == 0) return { x: obj.x - 1, y: obj.y };
    if (obj.x + 1 < grid.length && grid[obj.x + 1][obj.y] == 0) return { x: obj.x + 1, y: obj.y };
    if (obj.y - 1 >= 0 && grid[obj.x][obj.y - 1] == 0) return { x: obj.x, y: obj.y - 1 };
    if (obj.y + 1 < can.height / settings.size && grid[obj.x][obj.y + 1] == 0) return { x: obj.x, y: obj.y + 1 };
    return null;
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
        this.timeout = 200 + Math.random() * 1000;
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

        // var x_diff = ~~(Math.random() * can.width / settings.size) - this.pos.x;
        // var y_diff = ~~(Math.random() * can.height / settings.size) - this.pos.y;
        var done = false;
        var old_target = Object.assign({}, this.target);
        if (Math.abs(x_diff) > Math.abs(y_diff)) {
            // if (Math.random() > 0.5) {
            var temp = Object.assign({}, this.target);
            if (x_diff < 0) temp.x -= 1;
            else temp.x += 1;
            if (
                temp.x >= 0 && temp.x < grid.length &&
                temp.y >= 0 && temp.y < can.height / settings.size
            ) {
                if (settings.grid) {
                    if (grid[temp.x][temp.y] != 0) { done = false; }
                    else { this.target.x = temp.x; done = true; }
                } else {
                    this.target.x = temp.x;
                    done = true;
                }
            }
        }
        if (!done) {
            var temp = Object.assign({}, this.target);
            if (y_diff < 0) temp.y -= 1;
            else temp.y += 1;
            if (
                temp.x >= 0 && temp.x < grid.length &&
                temp.y >= 0 && temp.y < can.height / settings.size
            ) {
                if (settings.grid) {
                    if (grid[temp.x][temp.y] == 0) { this.target.y = temp.y; done = true; }
                }
                else {
                    this.target.y = temp.y;
                }
            }
        }
        if (settings.grid) {
            if (!done) {
                var free_space = get_free_space({
                    x: this.target.x,
                    y: this.target.y
                });
                if (free_space != null) {
                    this.target = Object.assign({}, free_space);
                    done = true;
                } else {
                    done = false;
                }
            }
            if (JSON.stringify(old_target) != JSON.stringify(this.target)) {
                grid[old_target.x][old_target.y] -= 1;
                grid[this.target.x][this.target.y] += 1;
                this.stalled = false;
            }
            else {
                this.stalled = true;
            }
        }
    }
    update() {
        if (this.relaxed) return;
        if (this.stalled) {
            this.setTarget();
        }
        if (this.stalled) return;
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
            this.endMid += settings.lerp;
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
                this.startMid += settings.lerp;
            } else {
                if (this.timeout) { this.relaxed = true; }
                this.pos = Object.assign({}, this.target);
                this.set();
                this.free();
                this.setTarget();
            }
        }
    }
    draw() {
        if (this.relaxed || (this.stalled && settings.grid)) {
            p.setType("stroke");
            ctx.strokeStyle = "rgb(255,0,0)";
            (this.stalled && settings.grid) && (ctx.strokeStyle = "rgb(0,0,255)");
            settings.showRelaxed && p.point({
                x: this.pos.x * settings.size,
                y: this.pos.y * settings.size
            }, 2);
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
    setup();
}
function gui() {
    var g = new dat.GUI();
    g.add(settings, "size", 5, 100);
    g.add(settings, "creatures", 1, 8000).step(1);
    g.add(settings, "grid");
    g.add(settings, "showRelaxed");
    g.add(settings, "showGrid");
}
function setup() {
    creatures = [];
    grid = [];
    global_val = {
        x: can.width / 2,
        y: can.height / 2
    };
    settings.creatures = Math.min(can.width / settings.size * can.height / settings.size, settings.creatures);
    for (var i = 0; i <= can.width / settings.size; ++i) {
        grid.push([]);
        for (var j = 0; j <= can.height / settings.size; ++j) {
            grid[i].push(0);
        }
    }
    for (var i = 0; i < settings.creatures; ++i) {
        var temp = new Creature();
        while (grid[temp.pos.x][temp.pos.y] != 0) temp = new Creature();
        creatures.push(temp);
        grid[temp.pos.x][temp.pos.y] = 1;
    }
}
function draw() {
    if (JSON.stringify(settings_copy) != JSON.stringify(settings)) {
        setup();
        settings_copy = Object.assign({}, settings);
    }
    p.clear();
    settings.showGrid && createGrid();
    for (var i = 0; i < creatures.length; ++i) {
        creatures[i].update();
        creatures[i].draw();
    }
    requestAnimationFrame(draw);
}
window.onresize = resize;
resize();
gui();
setup();
can.onmousemove = function (e) {
    global_val = {
        x: e.clientX,
        y: e.clientY
    };
};
requestAnimationFrame(draw);
