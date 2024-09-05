import { Body } from "./Body";
import { Vector } from "./Vector";

export class Collision {
  /**
   * @param {Vector} point
   * @param {Body} rect
   * @returns {boolean}
   */
  static isPointInRect(point, rect) {
    return (
      point.x >= rect.position.x &&
      point.x <= rect.position.x + rect.width &&
      point.y >= rect.position.y &&
      point.y <= rect.position.y + rect.height
    );
  }
}
