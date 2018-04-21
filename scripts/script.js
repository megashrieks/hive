var can = document.getElementById("can");
var ctx = can.getContext("2d");

var settings = {
    size: 30
};
var p = new can2d(can);
function createGrid() {
    var size = settings.size;
    ctx.fillStyle = "#000";
    for (var i = size; i < can.width; i += size) {
        for (var j = size; j < can.height; j += size) {
            p.point(i, j, 2);
        }
    }
}
function resize() {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
}
window.onresize = resize;
resize();
createGrid();
