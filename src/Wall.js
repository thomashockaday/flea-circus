import { Box } from "./core/Box";

export class Wall extends Box {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = "grey";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
