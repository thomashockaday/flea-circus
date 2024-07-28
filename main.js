import { Button } from "./src/Button";
import { Flea } from "./src/Flea";
import { Vector } from "./src/Vector";
import { Wall } from "./src/Wall";

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

const pointer = {
  x: 0,
  y: 0,
};

const buttons = {};
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

const entrance = {
  direction: "down",
  position: new Vector(TILE_SIZE, TILE_SIZE),
};
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
      const firstFleaOutOfPlay = fleasOutOfPlay[0];
      firstFleaOutOfPlay.inPlay = true;

      if (entrance.direction === "down") {
        firstFleaOutOfPlay.position.x =
          entrance.position.x + (TILE_SIZE - firstFleaOutOfPlay.width) / 2;
        firstFleaOutOfPlay.position.y =
          entrance.position.y + TILE_SIZE + firstFleaOutOfPlay.height;
      } else {
        throw "Entrance direction is not handled";
      }
    }
  }

  for (let i = 0; i < fleas.length; i++) {
    if (!fleas[i].inPlay) {
      continue;
    }

    const wallCollisions = {
      top: false,
      right: false,
      left: false,
    };

    walls.forEach((wall) => {
      if (
        wall.position.x <= fleas[i].position.x + fleas[i].width &&
        wall.position.x + wall.width >= fleas[i].position.x &&
        wall.position.y === fleas[i].position.y + fleas[i].height
      ) {
        wallCollisions.top = true;
      }

      if (
        wall.position.x + wall.width === fleas[i].position.x &&
        wall.position.y <= fleas[i].position.y &&
        wall.position.y + wall.height >= fleas[i].position.y + fleas[i].height
      ) {
        wallCollisions.right = true;
      }

      if (
        wall.position.x === fleas[i].position.x + fleas[i].width &&
        wall.position.y <= fleas[i].position.y &&
        wall.position.y + wall.height >= fleas[i].position.y + fleas[i].height
      ) {
        wallCollisions.left = true;
      }
    });

    const rightRampCollisions = {
      top: false,
      right: false,
      left: false,
      inside: false,
    };

    rightRamps.forEach((ramp) => {
      if (
        ramp.position.x === fleas[i].position.x + fleas[i].width &&
        ramp.position.y <= fleas[i].position.y &&
        ramp.position.y + ramp.height >= fleas[i].position.y + fleas[i].height
      ) {
        rightRampCollisions.left = true;
      }

      if (
        ramp.position.x <= fleas[i].position.x + fleas[i].width &&
        ramp.position.x + ramp.width >= fleas[i].position.x &&
        ramp.position.y <= fleas[i].position.y + fleas[i].height &&
        ramp.position.y + ramp.height >= fleas[i].position.y
      ) {
        rightRampCollisions.inside = true;
      }
    });

    let currentVelocity = fleas[i].velocity;

    // gravity
    fleas[i].velocity.y = 1;

    // set positive velocities when not negative (go forward by default)
    if (fleas[i].velocity.x === 0) {
      fleas[i].velocity.x = 1;
    }

    // cancel forward movement when falling
    if (
      !wallCollisions.top &&
      !wallCollisions.left &&
      !wallCollisions.right &&
      !rightRampCollisions.inside
    ) {
      fleas[i].velocity.x = 0;
    }

    // cancel gravity when on top of a wall
    if (wallCollisions.top) {
      fleas[i].velocity.y = 0;
    }

    // if hitting the left side of a right-ramp, go up
    if (rightRampCollisions.left) {
      fleas[i].velocity.y = -1;
      fleas[i].velocity.x = 1;
      fleas[i].goingUpRightRamp = true;
    }

    // if inside a ramp tile, continue
    if (rightRampCollisions.inside) {
      fleas[i].velocity = currentVelocity;
    }

    if (!rightRampCollisions.inside) {
      fleas[i].goingUpRightRamp = false;
    }

    if (fleas[i].goingUpRightRamp === true) {
      fleas[i].velocity.y = -1;
      fleas[i].velocity.x = 1;
    }

    // bounce off left side of wall and go backwards
    if (wallCollisions.left) {
      fleas[i].velocity.x = -1;
    }

    // bounce off right side of wall and go forwards
    if (wallCollisions.right) {
      fleas[i].velocity.x = 1;
    }

    fleas[i].position.x += fleas[i].velocity.x;
    fleas[i].position.y += fleas[i].velocity.y;
  }

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  // main game rendering
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // right ramp hover
  if (
    addingRightRamp &&
    pointer.x < TILE_SIZE * 12 &&
    pointer.y < TILE_SIZE * 14
  ) {
    const ramp = {
      position: {
        x: pointer.x - (pointer.x % TILE_SIZE),
        y: pointer.y - (pointer.y % TILE_SIZE),
      },
    };

    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.moveTo(ramp.position.x, ramp.position.y + TILE_SIZE);
    ctx.lineTo(ramp.position.x + TILE_SIZE, ramp.position.y);
    ctx.lineTo(ramp.position.x + TILE_SIZE, ramp.position.y + TILE_SIZE / 8);
    ctx.lineTo(ramp.position.x + TILE_SIZE / 8, ramp.position.y + TILE_SIZE);
    ctx.lineTo(ramp.position.x, ramp.position.y + TILE_SIZE);
    ctx.fill();
  }

  // entrance
  ctx.fillStyle = "green";
  ctx.fillRect(TILE_SIZE, TILE_SIZE, TILE_SIZE, TILE_SIZE);

  // right ramps
  rightRamps.forEach((ramp) => {
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.moveTo(ramp.position.x, ramp.position.y + TILE_SIZE);
    ctx.lineTo(ramp.position.x + TILE_SIZE, ramp.position.y);
    ctx.lineTo(ramp.position.x + TILE_SIZE, ramp.position.y + TILE_SIZE / 8);
    ctx.lineTo(ramp.position.x + TILE_SIZE / 8, ramp.position.y + TILE_SIZE);
    ctx.lineTo(ramp.position.x, ramp.position.y + TILE_SIZE);
    ctx.fill();
  });

  walls.forEach((wall) => {
    wall.draw(ctx);
  });

  fleas.forEach((flea) => {
    if (flea.inPlay) {
      flea.draw(ctx);
    }
  });

  buttons.startButton.draw(ctx);
  buttons.pauseButton.draw(ctx);
  buttons.addRightRampButton.draw(ctx);

  frameId = window.requestAnimationFrame(runAnimation);
}

function isPointInRect(point, rect) {
  return (
    point.x >= rect.position.x &&
    point.x <= rect.position.x + rect.width &&
    point.y >= rect.position.y &&
    point.y <= rect.position.y + rect.height
  );
}

function addInteractionHandling() {
  canvas.addEventListener(
    "pointerdown",
    (event) => {
      pointer.x = event.offsetX;
      pointer.y = event.offsetY;

      buttons.startButton.isPressed = isPointInRect(
        pointer,
        buttons.startButton
      );

      buttons.pauseButton.isPressed = isPointInRect(
        pointer,
        buttons.pauseButton
      );

      buttons.addRightRampButton.isPressed = isPointInRect(
        pointer,
        buttons.addRightRampButton
      );

      if (buttons.pauseButton.isPressed) {
        buttons.pauseButton.text = paused ? "Pause" : "Play";
      }
    },
    false
  );

  canvas.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.offsetX;
      pointer.y = event.offsetY;

      if (buttons.startButton.isPressed) {
        buttons.startButton.isPressed = isPointInRect(
          pointer,
          buttons.startButton
        );
      }

      if (buttons.pauseButton.isPressed) {
        buttons.pauseButton.isPressed = isPointInRect(
          pointer,
          buttons.pauseButton
        );
      }

      if (buttons.addRightRampButton.isPressed) {
        buttons.addRightRampButton.isPressed = isPointInRect(
          pointer,
          buttons.addRightRampButton
        );
      }
    },
    false
  );

  canvas.addEventListener(
    "pointerup",
    (event) => {
      pointer.x = event.offsetX;
      pointer.y = event.offsetY;

      // start
      buttons.startButton.isPressed = isPointInRect(
        pointer,
        buttons.startButton
      );

      if (buttons.startButton.isPressed && !paused) {
        levelStarted = true;
      }

      buttons.startButton.isPressed = false;

      // pause
      buttons.pauseButton.isPressed = isPointInRect(
        pointer,
        buttons.pauseButton
      );

      if (buttons.pauseButton.isPressed) {
        if (paused) {
          startAnimation();
        } else {
          pauseAnimation();
        }
      }

      buttons.pauseButton.isPressed = false;

      // add right ramp
      buttons.addRightRampButton.isPressed = isPointInRect(
        pointer,
        buttons.addRightRampButton
      );

      if (
        addingRightRamp &&
        pointer.x < TILE_SIZE * 12 &&
        pointer.y < TILE_SIZE * 14
      ) {
        rightRamps.push({
          position: {
            x: event.offsetX - (event.offsetX % TILE_SIZE),
            y: event.offsetY - (event.offsetY % TILE_SIZE),
          },
          width: TILE_SIZE,
          height: TILE_SIZE,
        });
      }

      addingRightRamp = buttons.addRightRampButton.isPressed;
      buttons.addRightRampButton.isPressed = false;
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

  buttons.startButton = new Button(
    new Vector(0, TILE_SIZE * 15),
    TILE_SIZE * 3,
    TILE_SIZE * 1.5,
    "Start"
  );
  buttons.pauseButton = new Button(
    new Vector(TILE_SIZE * 4, TILE_SIZE * 15),
    TILE_SIZE * 3,
    TILE_SIZE * 1.5,
    "Pause"
  );
  buttons.addRightRampButton = new Button(
    new Vector(TILE_SIZE * 8, TILE_SIZE * 15),
    TILE_SIZE * 3,
    TILE_SIZE * 1.5,
    "/"
  );

  addInteractionHandling();
}

addEventListener("DOMContentLoaded", () => {
  init();
});
