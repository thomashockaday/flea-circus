import { Vector } from "./Vector";

export class Flea {
  /**
   * @param {Vector} position
   * @param {number} width
   * @param {number} height
   */
  constructor(position, width, height) {
    this.position = position;
    this.width = width;
    this.height = height;

    this.velocity = new Vector(0, 0);

    this.inPlay = false;
    this.goingUpRightRamp = false;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
