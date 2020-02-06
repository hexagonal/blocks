"use strict";
var Point_1 = require('./Point');
function createBlankRow(length) {
    var row = [];
    for (var i = 0; i < length; i++) {
        row.push(null);
    }
    return row;
}
function rowIsUnfilled(row) {
    return row.some(function (x) { return x === null; });
}
var Grid = (function () {
    function Grid(columnSize, rowSize) {
        this._grid = [];
        this._columnSize = columnSize;
        this._rowSize = rowSize;
        for (var i = 0; i < this._rowSize; i++) {
            this._grid.push(createBlankRow(this._columnSize));
        }
    }
    Grid.prototype.has = function (point) {
        return this._grid[point.y][point.x] !== null;
    };
    Grid.prototype.outOfBounds = function (point) {
        return (point.x < 0 ||
            point.y < 0 ||
            point.x >= this._columnSize ||
            point.y >= this._rowSize);
    };
    Grid.prototype.valid = function (brick) {
        for (var _i = 0, _a = brick.blocks; _i < _a.length; _i++) {
            var block = _a[_i];
            if (this.outOfBounds(block)) {
                return false;
            }
            if (this.has(block)) {
                return false;
            }
        }
        return true;
    };
    Grid.prototype.add = function (brick) {
        for (var _i = 0, _a = brick.blocks; _i < _a.length; _i++) {
            var block = _a[_i];
            this.setCell(block, { color: brick.color });
        }
    };
    Grid.prototype.clearRows = function () {
        var unfilledRows = this._grid.filter(rowIsUnfilled);
        this._grid = [];
        for (var i = unfilledRows.length; i < this._rowSize; i++) {
            this._grid.push(createBlankRow(this._columnSize));
        }
        Array.prototype.push.apply(this._grid, unfilledRows);
    };
    Object.defineProperty(Grid.prototype, "blocks", {
        get: function () {
            var result = [];
            for (var y = 0; y < this._rowSize; y++) {
                for (var x = 0; x < this._columnSize; x++) {
                    var block = new Point_1.default(x, y);
                    if (this.has(block)) {
                        result.push(block);
                    }
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Grid.prototype.getCell = function (block) {
        return this._grid[block.y][block.x];
    };
    Grid.prototype.setCell = function (block, cell) {
        this._grid[block.y][block.x] = cell;
    };
    Object.defineProperty(Grid.prototype, "columnSize", {
        get: function () { return this._columnSize; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "rowSize", {
        get: function () { return this._rowSize; },
        enumerable: true,
        configurable: true
    });
    return Grid;
})();
exports.Grid = Grid;
//# sourceMappingURL=Grid.js.map