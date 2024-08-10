import { Body } from "./core/Body";

export class RightRamp extends Body {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y + this.height);
    ctx.lineTo(this.position.x + this.width, this.position.y);
    ctx.lineTo(this.position.x + this.width, this.position.y + this.height / 8);
    ctx.lineTo(this.position.x + this.width / 8, this.position.y + this.height);
    ctx.lineTo(this.position.x, this.position.y + this.height);
    ctx.fill();
  }
}
