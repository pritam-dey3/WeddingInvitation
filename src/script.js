// Point class to store x and y coordinates
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Method to display the coordinates of the point
  display() {
    return `${this.x} ${this.y}`;
  }
}

function debugOnScreen(text) {
  const debug = document.createElement("div");
  debug.className = "debug";
  debug.innerHTML = text;
}

function createDot(x, y) {
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  document.body.appendChild(dot);
}

function removeDot() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach(dot => dot.remove());
}

function createRandomColor(target) {
  const h = Math.floor(Math.random() * 360);
  const s = 100; const l = 81;

  const bf_wings = document.querySelectorAll(`${target} .wing-path`);
  bf_wings.forEach(wing => {
    wing.style.fill = `hsl(${h}, ${s}%, ${l}%, 0.72)`;
  });
}

// Function to create random points within a specified range
function createRandomPoint(maxX, maxY) {
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  return new Point(x, y);
}

// Function to create a random point between two bounds
function createRandomPointBetween(minX, maxX, minY, maxY) {
  const x = Math.random() * (maxX - minX) + minX;
  const y = Math.random() * (maxY - minY) + minY;
  return new Point(Math.round(x), Math.round(y));
}

function cloneAndAppendToParent(id, newId) {
  let original = document.getElementById(id);
  let clone = original.cloneNode(true);
  clone.id = newId;
  original.parentNode.appendChild(clone);
}

// Function to create an SVG path between point A and point B with random points in between
function createSVGPath(width, height, numPoints = 4, reverse = false, target = ".bf") {
  removeDot();

  const gap = width / (numPoints + 1);
  let pointA = createRandomPoint(width, height);
  let pointB = createRandomPoint(width, height);
  let lastPoint = createRandomPoint(width, height);
  pointA.x = -gap;
  pointB.x = width;
  lastPoint.x = width + gap / 10;

  createDot(pointA.x, pointA.y);
  createDot(pointB.x, pointB.y);

  // adjusting variation
  const yMid = (pointA.y + pointB.y) / 2;
  const yThreshold = (Math.abs(pointA.y - pointB.y) / 8); // 25% of the difference

  // Create an array to store the points, starting with point A
  const points = [pointA];

  let lastX = pointA.x;
  // Generate random points between point A and point B
  for (let i = 0; i < numPoints; i++) {
    const randomPoint = createRandomPointBetween(
      Math.min(pointA.x, pointB.x),
      Math.max(pointA.x, pointB.x),
      Math.min(pointA.y, pointB.y),
      Math.max(pointA.y, pointB.y)
    );
    randomPoint.x = lastX + gap;
    lastX = randomPoint.x;

    // adjusting variation
    if (Math.abs(randomPoint.y - yMid) > yThreshold) {
      randomPoint.y = yMid + Math.sign(randomPoint.y - yMid) * yThreshold;
    }
    points.push(randomPoint);
    createDot(randomPoint.x, randomPoint.y);
  }
  // End with point B
  points.push(pointB);
  points.push(lastPoint);

  // Sort points by x-coordinate
  if (reverse) points.sort((a, b) => b.x - a.x);
  else
    points.sort((a, b) => a.x - b.x);

  // Construct the SVG path string
  let pathString = `M ${points[0].display()} C ${points[1].display()}, ${points[2].display()}, ${points[3].display()}`;
  for (let i = 4; i < points.length - 1; i += 2) {
    const cp1 = points[i];
    const cp2 = points[i + 1];
    pathString += ` S ${cp1.display()}, ${cp2.display()}`;
  }

  // Set the path attribute
  document.querySelector(`${target}-path`).setAttribute('d', pathString);
  return pathString;
}


// Animate the element along the SVG path
function animateAlongPath(target = ".bf") {
  const screenWidth = document.querySelector('.svg-path-container').clientWidth;
  const screenHeight = document.querySelector('.svg-path-container').clientHeight;
  debugOnScreen(`Width: ${screenWidth}, Height: ${screenHeight}`);

  createRandomColor(target);
  // Generate and return SVG path with 5 random points between A and B
  let start_from_left = Math.random() > 0.5 ? true : false;
  createSVGPath(screenWidth, screenHeight, 5, !start_from_left, target);
  const path = anime.path(`${target}-path`);
  const length = path('x').totalLength;
  const bfTransform = { x: 0, y: 0, angle: 0 };
  const bfElem = document.querySelector(target);

  anime({
    targets: bfTransform,
    x: path('x'),
    y: path('y'),
    angle: path('angle'),
    easing: 'linear',
    duration: length * 7.2,
    loop: false,
    update: function () {
      bfElem.style.transform = `translate(${bfTransform.x}px, ${bfTransform.y}px) rotate(${bfTransform.angle + 90}deg)`;
    },
    complete: function () {
      animateAlongPath(target);
    }
  });
}

// Initialize the SVG and start the animation
// document.querySelector('svg').setAttribute('viewBox', `0 0 ${screenWidth} ${screenHeight}`);

document.addEventListener('pageLoaded', function () {
  cloneAndAppendToParent("bf-1", "bf-2");
  cloneAndAppendToParent("bf-1-path", "bf-2-path");
  animateAlongPath("#bf-1");
  animateAlongPath("#bf-2");
});