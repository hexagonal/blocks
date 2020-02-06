import {Brick} from './Brick'
import Point from './Point'

interface Cell {
  color: string;
}

type Row = Cell[];

function createBlankRow(length: number): Row {
  let row: Row = [];

  for (let i = 0; i < length; i++) {
    row.push(null);
  }

  return row;
}

function rowIsUnfilled(row: Row): boolean {
  return row.some(x => x === null);
}

export class Grid {
  private _grid: Row[] = [];
  private _columnSize: number;
  private _rowSize: number;

  constructor (columnSize: number, rowSize: number) {
    this._columnSize = columnSize;
    this._rowSize = rowSize;

    for (let i = 0; i < this._rowSize; i++) {
      this._grid.push(createBlankRow(this._columnSize));
    }
  }

  private has(point: Point): boolean {
    return this._grid[point.y][point.x] !== null;
  }

  private outOfBounds(point:Point): boolean {
    return (
      point.x < 0 ||
      point.y < 0 ||
      point.x >= this._columnSize ||
      point.y >= this._rowSize
    );
  }

  valid(brick: Brick): boolean {
    for (let block of brick.blocks) {
      if (this.outOfBounds(block)) { return false; }
      if (this.has(block)) { return false; }
    }

    return true;
  }

  add(brick: Brick): void {
    for (let block of brick.blocks) {
      this.setCell(block, {color: brick.color});
    }
  }

  clearRows(): void {
    let unfilledRows: Row[] = this._grid.filter(rowIsUnfilled);

    // Push blank rows into the top of the grid
    this._grid = [];
    for (let i = unfilledRows.length; i < this._rowSize; i++) {
      this._grid.push(createBlankRow(this._columnSize));
    }

    // Push unfilled rows into the bottom of the grid
    Array.prototype.push.apply(this._grid, unfilledRows);
  }

  get blocks(): Point[] {
    let result: Point[] = [];

    for (let y = 0; y < this._rowSize; y++) {
      for (let x = 0; x < this._columnSize; x++) {
        let block = new Point(x, y);
        if (this.has(block)) { result.push(block); }
      }
    }

    return result;
  }

  getCell(block: Point) {
    return this._grid[block.y][block.x];
  }

  private setCell(block: Point, cell: Cell): void {
    this._grid[block.y][block.x] = cell;
  }

  get columnSize(): number { return this._columnSize; }
  get rowSize(): number { return this._rowSize; }
}
