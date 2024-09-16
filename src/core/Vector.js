export class Vector {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {Vector} vector
   */
  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
}
