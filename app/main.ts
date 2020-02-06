/// <reference path="../typings/es6-shim/es6-shim.d.ts"/>

import {Observable, Subscriber, Subscription} from 'Rxjs';
import Point from './Point';
import {Brick} from './Brick';
import {Grid} from './Grid';

enum Action {
  nop,
  left,
  right,
  down,
  tick,
  anticlockwise,
  clockwise
};

interface Model
{
  grid: Grid,
  brick: Brick
}

const initialModel: Model =
  {
    grid: new Grid(10, 20),
    brick: Brick.nextBrick()
  };

function actionFromKeyCode(keyCode: number): Action {
  switch(keyCode)
  {
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

type Timestamp = number;
type Handle = number;

const fps = 30;
const sampleRate = Math.floor(1000 / fps);

let frames: Observable<Timestamp> =
  Observable
  .create((subscriber: Subscriber<Timestamp>) => {
    var id = requestAnimationFrame(loop);

    function loop(timestamp: Timestamp) {
      subscriber.next(timestamp);
      id = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(id);
  })
	.sampleTime(sampleRate);

let actions =
  Observable
	.fromEvent(document.body, 'keydown')
	.map(event => (<KeyboardEvent>event).keyCode)
	.map(actionFromKeyCode)
	.buffer(frames);

let subscription: Subscription<Model>  = null;

function subscribe() {
  if (subscription) {
  	subscription.unsubscribe();
    subscription = null;
  } else {
    // MAIN LOOP
    subscription =
      actions
      .scan(update, initialModel)
      .subscribe(view);
  }
}

let frameCount: number = 12;

function update(model: Model, actions: Action[]): Model {
  let brick: Brick = null;

  if (frameCount === -1) {
    actions.push(Action.tick);
    frameCount = 30;
  }

  frameCount -= 1;

  for (let action of actions)
  {
    switch(action) {
      case Action.left:
        brick =  model.brick.moveLeft();
        break;
      case Action.right:
        brick =  model.brick.moveRight();
        break;
      case Action.down:
      case Action.tick:
        brick =  model.brick.moveDown();
        break;
      case Action.clockwise:
        brick =  model.brick.rotateClockwise();
        break;
      case Action.anticlockwise:
        brick =  model.brick.rotateAnticlockwise();
        break;
    }

    if(brick) {
      let valid = model.grid.valid(brick);

      if (valid) {
        model.brick = brick;
      } else if (action === Action.tick) {
        model.grid.add(model.brick);
        model.grid.clearRows();
        model.brick = Brick.nextBrick();
        break;
      }
    }
  }

  return model;
}

// Constants
const blockSize = 24;
const halfBlockSize = blockSize / 2;
const canvasWidth = initialModel.grid.columnSize * blockSize;
const canvasHeight = initialModel.grid.rowSize * blockSize;

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
canvas.height = canvasHeight;
canvas.width = canvasWidth;
const ctx = canvas.getContext('2d');

function view(model: Model) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let block of model.brick.blocks) {
    viewBlock(block, model.brick.color);
  }

  for (let block of model.grid.blocks) {
    viewBlock(block, model.grid.getCell(block).color);
  }

  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function viewBlock(block: Point, color: string) {
  ctx.fillStyle = color;
  ctx.strokeStyle = 'gray';

  let left = block.x * blockSize;
  let top = block.y * blockSize;

  ctx.fillRect(left, top, blockSize, blockSize);
  ctx.strokeRect(left, top, blockSize, blockSize);
}

const subscribeButton = document.getElementById('subscribe');
subscribeButton.addEventListener('click', _ => subscribe());
