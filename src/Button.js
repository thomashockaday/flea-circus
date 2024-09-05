import { Body } from "./core/Body";
import { Vector } from "./core/Vector";

export class Button extends Body {
  /**
   * @param {Vector} position
   * @param {number} width
   * @param {number} height
   * @param {string} text
   * @param {Function} pressFunction
   */
  constructor(position, width, height, text, pressFunction) {
    super(position, width, height);

    this.text = text;
    this.pressFunction = pressFunction;

    this.isPressed = false;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.isPressed) {
      ctx.fillStyle = "#6089bf";
    } else {
      ctx.fillStyle = "#2975d9";
    }

    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    ctx.font = "20px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";

    ctx.fillText(
      this.text,
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
  }
}
