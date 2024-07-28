import { Vector } from "./Vector";

export class Wall {
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

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = "grey";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
