"use strict";
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
        Object.freeze(this);
    }
    Point.prototype.plus = function (rhs) {
        return new Point(this.x + rhs.x, this.y + rhs.y);
    };
    Point.prototype.minus = function (rhs) {
        return new Point(this.x - rhs.x, this.y - rhs.y);
    };
    return Point;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Point;
//# sourceMappingURL=Point.js.map