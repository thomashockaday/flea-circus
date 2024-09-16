import { Box } from "./core/Box";
import { Vector } from "./core/Vector";

export class Flea extends Box {
  /**
   * @param {Vector} position
   * @param {number} width
   * @param {number} height
   */
  constructor(position, width, height) {
    super(position, width, height);

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
