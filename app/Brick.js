"use strict";
var Point_1 = require('./Point');
(function (BrickType) {
    BrickType[BrickType["O"] = 0] = "O";
    BrickType[BrickType["I"] = 1] = "I";
    BrickType[BrickType["T"] = 2] = "T";
    BrickType[BrickType["J"] = 3] = "J";
    BrickType[BrickType["L"] = 4] = "L";
    BrickType[BrickType["S"] = 5] = "S";
    BrickType[BrickType["Z"] = 6] = "Z";
})(exports.BrickType || (exports.BrickType = {}));
var BrickType = exports.BrickType;
var O_BLOCKS = [
    new Point_1.default(0, 0),
    new Point_1.default(1, 0),
    new Point_1.default(0, 1),
    new Point_1.default(1, 1)
];
var I_BLOCKS = [
    new Point_1.default(1, 0),
    new Point_1.default(1, 1),
    new Point_1.default(1, 2),
    new Point_1.default(1, 3)
];
var T_BLOCKS = [
    new Point_1.default(0, 1),
    new Point_1.default(1, 1),
    new Point_1.default(2, 1),
    new Point_1.default(1, 2)
];
var J_BLOCKS = [
    new Point_1.default(1, 0),
    new Point_1.default(1, 1),
    new Point_1.default(1, 2),
    new Point_1.default(0, 2)
];
var L_BLOCKS = [
    new Point_1.default(1, 0),
    new Point_1.default(1, 1),
    new Point_1.default(1, 2),
    new Point_1.default(2, 2)
];
var Z_BLOCKS = [
    new Point_1.default(0, 1),
    new Point_1.default(1, 1),
    new Point_1.default(1, 2),
    new Point_1.default(2, 2)
];
var S_BLOCKS = [
    new Point_1.default(0, 2),
    new Point_1.default(1, 2),
    new Point_1.default(1, 1),
    new Point_1.default(2, 1)
];
function blocksFor(type) {
    switch (type) {
        case BrickType.O: return O_BLOCKS;
        case BrickType.I: return I_BLOCKS;
        case BrickType.T: return T_BLOCKS;
        case BrickType.J: return J_BLOCKS;
        case BrickType.L: return L_BLOCKS;
        case BrickType.S: return S_BLOCKS;
        case BrickType.Z: return Z_BLOCKS;
    }
}
function colorFor(type) {
    switch (type) {
        case BrickType.O: return 'yellow';
        case BrickType.I: return 'cyan';
        case BrickType.T: return 'purple';
        case BrickType.J: return 'blue';
        case BrickType.L: return 'orange';
        case BrickType.S: return 'green';
        case BrickType.Z: return 'red';
    }
}
function centerOf(points) {
    var xs = points.map(function (p) { return p.x; });
    var ys = points.map(function (p) { return p.y; });
    var x = Math.max.apply(Math, xs);
    var y = Math.max.apply(Math, ys);
    var n = Math.max(x, y) / 2;
    return new Point_1.default(n, n);
}
function startPositionFor(type) {
    switch (type) {
        case BrickType.O: return new Point_1.default(4, 0);
        case BrickType.I: return new Point_1.default(3, 0);
        case BrickType.T: return new Point_1.default(3, 0);
        case BrickType.J: return new Point_1.default(4, 0);
        case BrickType.L: return new Point_1.default(3, 0);
        case BrickType.S: return new Point_1.default(3, 0);
        case BrickType.Z: return new Point_1.default(3, 0);
    }
}
function rotate(point) {
    return new Point_1.default(point.x - (point.x + point.y), point.y + (point.x - point.y));
}
function rotatePoints(points, center) {
    return (points
        .map(function (p) { return p.minus(center); })
        .map(rotate)
        .map(function (p) { return p.plus(center); }));
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function shuffle(arr) {
    var top = arr.length;
    if (top)
        while (--top) {
            var current = Math.floor(Math.random() * (top + 1));
            var item = arr[current];
            arr[current] = arr[top];
            arr[top] = item;
        }
}
var BrickBagGenerator = (function () {
    function BrickBagGenerator() {
        this._brickTypes = [];
        this._top = -1;
    }
    Object.defineProperty(BrickBagGenerator.prototype, "bricks", {
        get: function () {
            var _this = this;
            return {
                next: function () {
                    if (_this._top === -1) {
                        _this._brickTypes = BrickBagGenerator.resetBrickTypes();
                        shuffle(_this._brickTypes);
                        _this._top = _this._brickTypes.length - 1;
                    }
                    var brick = new Brick(_this._brickTypes[_this._top]);
                    _this._top -= 1;
                    return { value: brick, done: false };
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    BrickBagGenerator.resetBrickTypes = function () {
        var brickTypes = [];
        for (var i = 0; i < 1; i++) {
            for (var j = 0; j < 7; j++) {
                brickTypes.push(j);
            }
        }
        return brickTypes;
    };
    return BrickBagGenerator;
})();
var BrickNoFloodGenerator = (function () {
    function BrickNoFloodGenerator() {
        this._recentTypes = [];
        this._recentTypes = Array(4);
    }
    Object.defineProperty(BrickNoFloodGenerator.prototype, "bricks", {
        get: function () {
            var _this = this;
            return {
                next: function () {
                    var _loop_1 = function() {
                        var type = (getRandomInt(0, 7));
                        if (_this._recentTypes.some(function (x) { return x === type; })) {
                            return "continue";
                        }
                        _this._recentTypes.shift();
                        _this._recentTypes.push(type);
                        var brick = new Brick(type);
                        return { value: { value: brick, done: false } };
                    };
                    while (true) {
                        var state_1 = _loop_1();
                        if (typeof state_1 === "object") return state_1.value
                        if (state_1 === "continue") continue;
                    }
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    return BrickNoFloodGenerator;
})();
var bricks = new BrickNoFloodGenerator().bricks;
var Brick = (function () {
    function Brick(rhs) {
        if (typeof rhs === 'number') {
            var type = rhs;
            this._type = type;
            this._color = colorFor(this._type);
            this._blocks = blocksFor(this._type);
            this._center = centerOf(this._blocks);
            this._position = startPositionFor(this._type);
        }
        else {
            this._type = rhs._type;
            this._blocks = rhs._blocks;
            this._position = rhs._position;
            this._center = rhs._center;
            this._color = rhs._color;
            this._center = centerOf(this._blocks);
        }
    }
    Brick.nextBrick = function () {
        return bricks.next().value;
    };
    Brick.prototype.rotateClockwise = function () {
        var brick = new Brick(this);
        brick._blocks = rotatePoints(this._blocks, this._center);
        return brick;
    };
    Brick.prototype.rotateAnticlockwise = function () {
        return (this
            .rotateClockwise()
            .rotateClockwise()
            .rotateClockwise());
    };
    Brick.prototype.moveLeft = function () {
        var brick = new Brick(this);
        brick._position = new Point_1.default(this._position.x - 1, this._position.y);
        return brick;
    };
    Brick.prototype.moveRight = function () {
        var brick = new Brick(this);
        brick._position = new Point_1.default(this._position.x + 1, this._position.y);
        return brick;
    };
    Brick.prototype.moveDown = function () {
        var brick = new Brick(this);
        brick._position = new Point_1.default(this._position.x, this._position.y + 1);
        return brick;
    };
    Object.defineProperty(Brick.prototype, "color", {
        get: function () {
            return this._color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brick.prototype, "blocks", {
        get: function () {
            var _this = this;
            return this._blocks.map(function (p) { return p.plus(_this._position); });
        },
        enumerable: true,
        configurable: true
    });
    return Brick;
})();
exports.Brick = Brick;
//# sourceMappingURL=Brick.js.map