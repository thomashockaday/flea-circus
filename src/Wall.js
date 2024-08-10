import { Body } from "./core/Body";

export class Wall extends Body {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = "grey";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
