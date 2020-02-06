"use strict";
var Rxjs_1 = require('Rxjs');
var Brick_1 = require('./Brick');
var Grid_1 = require('./Grid');
var Action;
(function (Action) {
    Action[Action["nop"] = 0] = "nop";
    Action[Action["left"] = 1] = "left";
    Action[Action["right"] = 2] = "right";
    Action[Action["down"] = 3] = "down";
    Action[Action["tick"] = 4] = "tick";
    Action[Action["anticlockwise"] = 5] = "anticlockwise";
    Action[Action["clockwise"] = 6] = "clockwise";
})(Action || (Action = {}));
;
var initialModel = {
    grid: new Grid_1.Grid(10, 20),
    brick: Brick_1.Brick.nextBrick()
};
function actionFromKeyCode(keyCode) {
    switch (keyCode) {
        case 65:
        case 37:
            return Action.left;
        case 68:
        case 39:
            return Action.right;
        case 83:
        case 40:
            return Action.down;
        case 81:
            return Action.anticlockwise;
        case 38:
        case 69:
            return Action.clockwise;
        default:
            return Action.nop;
    }
}
var fps = 30;
var sampleRate = Math.floor(1000 / fps);
var frames = Rxjs_1.Observable
    .create(function (subscriber) {
    var id = requestAnimationFrame(loop);
    function loop(timestamp) {
        subscriber.next(timestamp);
        id = requestAnimationFrame(loop);
    }
    return function () { return cancelAnimationFrame(id); };
})
    .sampleTime(sampleRate);
var actions = Rxjs_1.Observable
    .fromEvent(document.body, 'keydown')
    .map(function (event) { return event.keyCode; })
    .map(actionFromKeyCode)
    .buffer(frames);
var subscription = null;
function subscribe() {
    if (subscription) {
        subscription.unsubscribe();
        subscription = null;
    }
    else {
        subscription =
            actions
                .scan(update, initialModel)
                .subscribe(view);
    }
}
var frameCount = 12;
function update(model, actions) {
    var brick = null;
    if (frameCount === -1) {
        actions.push(Action.tick);
        frameCount = 30;
    }
    frameCount -= 1;
    for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
        var action = actions_1[_i];
        switch (action) {
            case Action.left:
                brick = model.brick.moveLeft();
                break;
            case Action.right:
                brick = model.brick.moveRight();
                break;
            case Action.down:
            case Action.tick:
                brick = model.brick.moveDown();
                break;
            case Action.clockwise:
                brick = model.brick.rotateClockwise();
                break;
            case Action.anticlockwise:
                brick = model.brick.rotateAnticlockwise();
                break;
        }
        if (brick) {
            var valid = model.grid.valid(brick);
            if (valid) {
                model.brick = brick;
            }
            else if (action === Action.tick) {
                model.grid.add(model.brick);
                model.grid.clearRows();
                model.brick = Brick_1.Brick.nextBrick();
                break;
            }
        }
    }
    return model;
}
var blockSize = 24;
var halfBlockSize = blockSize / 2;
var canvasWidth = initialModel.grid.columnSize * blockSize;
var canvasHeight = initialModel.grid.rowSize * blockSize;
var canvas = document.getElementById('canvas');
canvas.height = canvasHeight;
canvas.width = canvasWidth;
var ctx = canvas.getContext('2d');
function view(model) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var _i = 0, _a = model.brick.blocks; _i < _a.length; _i++) {
        var block = _a[_i];
        viewBlock(block, model.brick.color);
    }
    for (var _b = 0, _c = model.grid.blocks; _b < _c.length; _b++) {
        var block = _c[_b];
        viewBlock(block, model.grid.getCell(block).color);
    }
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}
function viewBlock(block, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = 'gray';
    var left = block.x * blockSize;
    var top = block.y * blockSize;
    ctx.fillRect(left, top, blockSize, blockSize);
    ctx.strokeRect(left, top, blockSize, blockSize);
}
var subscribeButton = document.getElementById('subscribe');
subscribeButton.addEventListener('click', function (_) { return subscribe(); });
//# sourceMappingURL=main.js.map