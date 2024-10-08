import { Button } from "./src/Button";
import { Entrance } from "./src/Entrance";
import { Flea } from "./src/Flea";
import { RightRamp } from "./src/RightRamp";
import { Wall } from "./src/Wall";
import { Collision } from "./src/core/Collision";
import { CollisionMap } from "./src/core/CollisionMap";
import { Vector } from "./src/core/Vector";

// todo

// do not add ramp if tile is taken up
// do not add ramp if not on level tiles
// flea goes up ramp
// flea goes down ramp
// add goal
// restart level button to clear all ramps
// score = fleas in goal
// when score = fleas.length, you win

let frameId = 0;
let paused = true;
let levelStarted = false;
let addingRightRamp = false;

const TILE_SIZE = 32;

/**
 * @type {HTMLCanvasElement}
 */
let canvas;
/**
 * @type {CanvasRenderingContext2D}
 */
let ctx;

const pointer = new Vector(0, 0);
const entrance = new Entrance(
  new Vector(TILE_SIZE, TILE_SIZE),
  TILE_SIZE,
  TILE_SIZE,
  "down"
);

/**
 * @type {Button[]}
 */
const buttons = [];
/**
 * @type {RightRamp[]}
 */
const rightRamps = [];
/**
 * @type {Wall[]}
 */
const walls = [
  // borders
  new Wall(new Vector(0, 0), TILE_SIZE, TILE_SIZE * 14),
  new Wall(new Vector(0, 0), TILE_SIZE * 12, TILE_SIZE),
  new Wall(new Vector(TILE_SIZE * 11, 0), TILE_SIZE, TILE_SIZE * 14),
  new Wall(new Vector(0, TILE_SIZE * 13), TILE_SIZE * 12, TILE_SIZE),

  // walls
  new Wall(new Vector(0, TILE_SIZE * 5), TILE_SIZE * 5, TILE_SIZE),
  new Wall(new Vector(TILE_SIZE * 6, TILE_SIZE * 4), TILE_SIZE * 4, TILE_SIZE),
  new Wall(new Vector(TILE_SIZE * 5, TILE_SIZE * 6), TILE_SIZE, TILE_SIZE),
  new Wall(new Vector(TILE_SIZE * 6, TILE_SIZE * 5), TILE_SIZE, TILE_SIZE),
  new Wall(new Vector(TILE_SIZE * 6, TILE_SIZE * 6), TILE_SIZE, TILE_SIZE),
  new Wall(new Vector(TILE_SIZE * 5, TILE_SIZE * 7), TILE_SIZE, TILE_SIZE),
  new Wall(new Vector(0, TILE_SIZE * 8), TILE_SIZE * 5, TILE_SIZE),
];
/**
 * @type {Flea[]}
 */
const fleas = [];

function firstStartAnimation() {
  startAnimation();

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function startAnimation() {
  if (paused) {
    paused = false;
    frameId = window.requestAnimationFrame(runAnimation);
  }
}

function pauseAnimation() {
  if (!paused) {
    cancelAnimationFrame(frameId);
    paused = true;
    frameId = 0;
  }
}

function runAnimation() {
  if (paused) {
    return;
  }

  // main game logic
  if (levelStarted) {
    const fleasOutOfPlay = fleas.filter((flea) => flea.inPlay === false);

    if (fleasOutOfPlay.length > 0 && frameId % 30 === 0) {
      entrance.spawn(fleasOutOfPlay[0]);
    }
  }

  for (let i = 0; i < fleas.length; i++) {
    if (!fleas[i].inPlay) {
      continue;
    }

    /**
     * @type {CollisionMap[]}
     */
    const wallCollisions = walls.map((wall) =>
      Collision.getRectRectCollision(wall, fleas[i])
    );
    /**
     * @type {CollisionMap[]}
     */
    const rightRampCollisions = rightRamps.map((ramp) =>
      Collision.getRectRectCollision(ramp, fleas[i])
    );

    // gravity
    fleas[i].velocity.y = 1;

    // set positive velocities when not negative (go forward by default)
    if (fleas[i].velocity.x === 0) {
      fleas[i].velocity.x = 1;
    }

    // cancel horizontal movement when falling
    if (
      !wallCollisions.some((collision) => collision.top || collision.bottom)
    ) {
      fleas[i].velocity.x = 0;
    }

    wallCollisions.forEach((collision) => {
      // cancel gravity when on top of a wall
      if (collision.top) {
        fleas[i].velocity.y = 0;
      }

      // bounce off right side of wall and go forwards
      if (collision.right) {
        fleas[i].velocity.x = 1;
      }

      // hit the bottom of a wall as a ceiling
      if (collision.bottom) {
        fleas[i].velocity.y = 0;
      }

      // bounce off left side of wall and go backwards
      if (collision.left) {
        fleas[i].velocity.x = -1;
      }
    });

    fleas[i].goingUpRightRamp = rightRampCollisions.some(
      (collision) => collision.inside
    );

    // rightRampCollisions.forEach((collision) => {
    //   // if hitting the left side of a right-ramp, go up
    //   if (collision.left) {
    //     fleas[i].velocity.y = -1;
    //     fleas[i].velocity.x = 1;
    //     fleas[i].goingUpRightRamp = true;
    //   }
    // });

    if (fleas[i].goingUpRightRamp === true) {
      fleas[i].velocity.y = -1;
      fleas[i].velocity.x = 1;
    }

    fleas[i].position = fleas[i].position.add(fleas[i].velocity);
  }

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  draw();

  frameId = window.requestAnimationFrame(runAnimation);
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // right ramp hover
  if (
    addingRightRamp &&
    pointer.x < TILE_SIZE * 12 &&
    pointer.y < TILE_SIZE * 14
  ) {
    const ramp = new RightRamp(
      new Vector(
        pointer.x - (pointer.x % TILE_SIZE),
        pointer.y - (pointer.y % TILE_SIZE)
      ),
      TILE_SIZE,
      TILE_SIZE
    );

    ramp.draw(ctx);
  }

  entrance.draw(ctx);

  rightRamps.forEach((ramp) => {
    ramp.draw(ctx);
  });

  walls.forEach((wall) => {
    wall.draw(ctx);
  });

  fleas.forEach((flea) => {
    if (!flea.inPlay) {
      return;
    }

    flea.draw(ctx);
  });

  buttons.forEach((button) => {
    button.draw(ctx);
  });
}

function addInteractionHandling() {
  canvas.addEventListener(
    "pointerdown",
    (event) => {
      pointer.x = event.offsetX;
      pointer.y = event.offsetY;

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].isPressed = Collision.isPointInRect(pointer, buttons[i]);
      }
    },
    false
  );

  canvas.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.offsetX;
      pointer.y = event.offsetY;

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].isPressed = Collision.isPointInRect(pointer, buttons[i]);
      }
    },
    false
  );

  canvas.addEventListener(
    "pointerup",
    (event) => {
      pointer.x = event.offsetX;
      pointer.y = event.offsetY;

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].isPressed = Collision.isPointInRect(pointer, buttons[i]);

        if (buttons[i].isPressed) {
          buttons[i].pressFunction();
        }
      }

      if (
        addingRightRamp &&
        pointer.x < TILE_SIZE * 12 &&
        pointer.y < TILE_SIZE * 14
      ) {
        rightRamps.push(
          new RightRamp(
            {
              x: event.offsetX - (event.offsetX % TILE_SIZE),
              y: event.offsetY - (event.offsetY % TILE_SIZE),
            },
            TILE_SIZE,
            TILE_SIZE
          )
        );

        addingRightRamp = false;
      }
    },
    false
  );
}

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  firstStartAnimation();

  for (let i = 0; i < 1; i++) {
    fleas.push(new Flea(new Vector(0, 0), TILE_SIZE / 8, TILE_SIZE / 8));
  }

  buttons.push(
    new Button(
      new Vector(0, TILE_SIZE * 15),
      TILE_SIZE * 3,
      TILE_SIZE * 1.5,
      "Start",
      function () {
        if (!paused) {
          levelStarted = true;
        }
      }
    )
  );
  buttons.push(
    new Button(
      new Vector(TILE_SIZE * 4, TILE_SIZE * 15),
      TILE_SIZE * 3,
      TILE_SIZE * 1.5,
      "Pause",
      function () {
        if (this.isPressed) {
          this.text = paused ? "Pause" : "Play";
          this.draw(ctx);
        }

        if (paused) {
          startAnimation();
        } else {
          pauseAnimation();
        }
      }
    )
  );
  buttons.push(
    new Button(
      new Vector(TILE_SIZE * 8, TILE_SIZE * 15),
      TILE_SIZE * 3,
      TILE_SIZE * 1.5,
      "/",
      function () {
        addingRightRamp = true;
      }
    )
  );

  addInteractionHandling();
}

addEventListener("DOMContentLoaded", () => {
  init();
});
