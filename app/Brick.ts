import Point from './Point';

export enum BrickType { O, I, T, J, L, S, Z }

const O_BLOCKS: Point[] = [
  new Point(0, 0),
  new Point(1, 0),
  new Point(0, 1),
  new Point(1, 1)
];

const I_BLOCKS: Point[] = [
  new Point(1, 0),
  new Point(1, 1),
  new Point(1, 2),
  new Point(1, 3)
];

const T_BLOCKS: Point[] = [
  new Point(0, 1),
  new Point(1, 1),
  new Point(2, 1),
  new Point(1, 2)
];

const J_BLOCKS: Point[] = [
  new Point(1, 0),
  new Point(1, 1),
  new Point(1, 2),
  new Point(0, 2)
];

const L_BLOCKS: Point[] = [
  new Point(1, 0),
  new Point(1, 1),
  new Point(1, 2),
  new Point(2, 2)
];

const Z_BLOCKS: Point[] = [
  new Point(0, 1),
  new Point(1, 1),
  new Point(1, 2),
  new Point(2, 2)
];

const S_BLOCKS: Point[] = [
  new Point(0, 2),
  new Point(1, 2),
  new Point(1, 1),
  new Point(2, 1)
];

function blocksFor(type: BrickType): Point[] {
  switch(type) {
    case BrickType.O: return O_BLOCKS;
    case BrickType.I: return I_BLOCKS;
    case BrickType.T: return T_BLOCKS;
    case BrickType.J: return J_BLOCKS;
    case BrickType.L: return L_BLOCKS;
    case BrickType.S: return S_BLOCKS;
    case BrickType.Z: return Z_BLOCKS;
  }
}

function colorFor(type: BrickType): string {
  switch(type) {
    case BrickType.O: return 'yellow';
    case BrickType.I: return 'cyan';
    case BrickType.T: return 'purple';
    case BrickType.J: return 'blue';
    case BrickType.L: return 'orange';
    case BrickType.S: return 'green';
    case BrickType.Z: return 'red';
  }
}

function centerOf(points: Point[]): Point {
  let xs = points.map(p => p.x);
  let ys = points.map(p => p.y);
  let x = Math.max(...xs);
  let y = Math.max(...ys);
  let n = Math.max(x, y) / 2;
  return new Point(n, n);
}

function startPositionFor(type: BrickType): Point {
  switch(type) {
    case BrickType.O: return new Point(4, 0);
    case BrickType.I: return new Point(3, 0);
    case BrickType.T: return new Point(3, 0);
    case BrickType.J: return new Point(4, 0);
    case BrickType.L: return new Point(3, 0);
    case BrickType.S: return new Point(3, 0);
    case BrickType.Z: return new Point(3, 0);
  }
}

function rotate(point: Point): Point {
  return new Point(
    point.x - (point.x + point.y),
    point.y + (point.x - point.y)
  );
}

function rotatePoints(points: Point[], center: Point): Point[] {
  return (
    points
    .map(p => p.minus(center))
    .map(rotate)
    .map(p => p.plus(center))
  );
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

// An efficient but impure shuffle: shuffles an array
function shuffle<T>(arr: T[]): void {
    let top: number = arr.length;

    if(top) while(--top) {
      let current: number = Math.floor(Math.random() * (top + 1));
      let item: T = arr[current];
      arr[current] = arr[top];
      arr[top] = item;
    }
}

class BrickBagGenerator {
  private _brickTypes: BrickType[] = [];
  private _top: number = -1;

  get bricks():Iterator<Brick> {
    return {
      next: () => {
        if (this._top === -1) {
          this._brickTypes = BrickBagGenerator.resetBrickTypes();
          shuffle(this._brickTypes);
          this._top = this._brickTypes.length - 1;
        }

        let brick = new Brick(this._brickTypes[this._top]);
        this._top -= 1;
        return {value: brick, done: false};
      }
    };
  }

  static resetBrickTypes(): BrickType[] {
    let brickTypes: BrickType[] = [];

    for(let i = 0; i < 1; i++) {
      for(let j = 0; j < 7; j++) {
        brickTypes.push(<BrickType>j);
      }
    }

    return brickTypes;
  }
}

class BrickNoFloodGenerator {
  private _recentTypes: BrickType[] = [];

  constructor() {
    this._recentTypes = Array(4);
  }

  get bricks():Iterator<Brick> {
    return {
      next: () => {
        while (true) {
          let type = <BrickType>(getRandomInt(0, 7))
          if (this._recentTypes.some(x => x === type)) { continue; }
          this._recentTypes.shift();
          this._recentTypes.push(type);
          let brick = new Brick(type);
          return {value: brick, done: false};
        }
      }
    };
  }
}

let bricks: Iterator<Brick> = new BrickNoFloodGenerator().bricks;

export class Brick {
  private _type: BrickType;
  private _color: string;
  private _blocks: Point[];
  private _position: Point;
  private _center: Point;

  //TODO: This should have the type BrickType | Brick
  // but TypeScript is currently fixing this bug
  constructor(rhs: number | Brick) {
    if (typeof rhs === 'number') {
      // Constructor
      let type = <BrickType>rhs;

      this._type = type;
      this._color = colorFor(this._type);
      this._blocks = blocksFor(this._type);
      this._center = centerOf(this._blocks);
      this._position = startPositionFor(this._type);
    } else {
      // Copy constructor
      this._type = rhs._type;
      this._blocks = rhs._blocks;
      this._position = rhs._position;
      this._center = rhs._center;
      this._color = rhs._color;
      this._center = centerOf(this._blocks);
    }
  }

  static nextBrick(): Brick {
    return bricks.next().value;
  }

  rotateClockwise(): Brick {
    let brick = new Brick(this);
    brick._blocks = rotatePoints(this._blocks, this._center);
    return brick;
  }

  rotateAnticlockwise(): Brick {
    return (
      this
      .rotateClockwise()
      .rotateClockwise()
      .rotateClockwise()
    );
  }

  moveLeft(): Brick {
    let brick = new Brick(this);
    brick._position = new Point(this._position.x - 1, this._position.y);
    return brick;
  }

  moveRight(): Brick {
    let brick = new Brick(this);
    brick._position = new Point(this._position.x + 1, this._position.y)
    return brick;
  }

  moveDown(): Brick {
    let brick = new Brick(this);
    brick._position = new Point(this._position.x, this._position.y + 1)
    return brick;
  }

  get color() : string {
    return this._color;
  }

  get blocks(): Point[] {
    return this._blocks.map(p => p.plus(this._position));
  }
}
