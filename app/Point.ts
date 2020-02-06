export default class Point {
  constructor(
    public x: number,
    public y: number) {
      Object.freeze(this);
  }

  plus(rhs: Point): Point {
    return new Point(this.x + rhs.x, this.y + rhs.y);
  }

  minus(rhs: Point): Point {
    return new Point(this.x - rhs.x, this.y - rhs.y);
  }
}
