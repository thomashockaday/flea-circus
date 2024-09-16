import { Flea } from "./Flea";
import { Box } from "./core/Box";

export class Entrance extends Box {
  constructor(position, width, height, direction) {
    super(position, width, height);

    this.direction = direction;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  /**
   * @param {Flea} flea
   */
  spawn(flea) {
    flea.inPlay = true;

    if (this.direction === "down") {
      flea.position.x = this.position.x + (this.width - flea.width) / 2;
      flea.position.y = this.position.y + this.height + flea.height;
    } else {
      throw "Entrance direction is not handled";
    }
  }
}
