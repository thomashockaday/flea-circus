import { Vector } from "./Vector";

export class Body {
  /**
   * @param {Vector} position
   * @param {number} width
   * @param {number} height
   */
  constructor(position, width, height) {
    this.position = position;
    this.width = width;
    this.height = height;
  }
}
