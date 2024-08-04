export class RightRamp {
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
