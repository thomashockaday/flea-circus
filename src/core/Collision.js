import { Box } from "./Box";
import { CollisionMap } from "./CollisionMap";
import { Vector } from "./Vector";

export class Collision {
  /**
   * @param {Vector} point
   * @param {Box} rect
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

  /**
   * @param {Box} rect1
   * @param {Box} rect2
   * @returns {CollisionMap}
   */
  static getRectRectCollision(rect1, rect2) {
    const collisionMap = new CollisionMap();

    if (
      rect1.position.x <= rect2.position.x + rect2.width &&
      rect1.position.x + rect1.width >= rect2.position.x &&
      rect1.position.y === rect2.position.y + rect2.height
    ) {
      collisionMap.top = true;
    }

    if (
      rect1.position.x + rect1.width === rect2.position.x &&
      rect1.position.y <= rect2.position.y &&
      rect1.position.y + rect1.height >= rect2.position.y + rect2.height
    ) {
      collisionMap.right = true;
    }

    if (
      rect1.position.x <= rect2.position.x + rect2.width &&
      rect1.position.x + rect1.width >= rect2.position.x &&
      rect1.position.y + rect1.height === rect2.position.y
    ) {
      collisionMap.bottom = true;
    }

    if (
      rect1.position.x === rect2.position.x + rect2.width &&
      rect1.position.y <= rect2.position.y &&
      rect1.position.y + rect1.height >= rect2.position.y + rect2.height
    ) {
      collisionMap.left = true;
    }

    if (
      rect1.position.x <= rect2.position.x + rect2.width &&
      rect1.position.x + rect1.width >= rect2.position.x &&
      rect1.position.y <= rect2.position.y + rect2.height &&
      rect1.position.y + rect1.height >= rect2.position.y
    ) {
      collisionMap.inside = true;
    }

    return collisionMap;
  }
}
