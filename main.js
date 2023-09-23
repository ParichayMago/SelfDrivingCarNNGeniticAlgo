const paddleCanvas = document.getElementById("paddleCanvas");
paddleCanvas.width = 800;
paddleCanvas.height = 600;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const paddleCtx = paddleCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const traffic = [
  new Balls((paddleCanvas.height / 2) * Math.random() * 2 - 1, -500),
  new Balls((paddleCanvas.height / 2) * Math.random() * 2 - 1, -200),
  new Balls((paddleCanvas.height / 2) * Math.random() * 2 - 1, -700),
  new Balls((paddleCanvas.height / 2) * Math.random() * 2 - 1, -800),
  new Balls((paddleCanvas.height / 2) * Math.random() * 2 - 1, -400),
  new Balls((paddleCanvas.height / 2) * Math.random() * 2 - 1, -600),
];

const N = 20;
const paddles = generatePaddles(N);
let bestPaddle = paddles[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < paddles.length; i++) {
    paddles[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(paddles[i].brain, 0.7);
    }
  }
}

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestPaddle.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function assessCollision(traffic) {
  for (let i = 0; i < traffic.length; i++) {
    for (let j = 0; j < paddles.length; j++) {}
  }
  return false;
}

function generatePaddles(N) {
  const paddles = [];
  for (let i = 0; i < N; i++) {
    paddles.push(
      new Paddle(
        paddleCanvas.width - 15 + i,
        (paddleCanvas.height / 2) * Math.random() * 2 - 1,
        10,
        80,
        traffic.length,
        "AI"
      )
    );
  }
  // paddles.push(
  //   new Paddle(
  //     paddleCanvas.width - 15,
  //     paddleCanvas.height / 2,
  //     10,
  //     80,
  //     traffic.length
  //   )
  // );
  return paddles;
}

function animate(time) {
  paddleCtx.clearRect(0, 0, paddleCanvas.width, paddleCanvas.height);
  networkCanvas.height = window.innerHeight;

  for (let i = 0; i < traffic.length; i++) {
    for (let j = 0; j < paddles.length; j++) {
      paddles[j].update(traffic);
      paddles[j].draw(paddleCtx);
    }
    traffic[i].update();
    traffic[i].draw(paddleCtx);
  }

  bestPaddle = Paddle.findFirstUndamaged(paddles);

  if (assessCollision(traffic)) {
    ball.speed *= -1;
  }

  for (let j = 0; j < paddles.length; j++) {
    for (let i = 0; i < traffic.length; i++) {
      const paddle = paddles[j];
      const ball = traffic[i];
      if (ball.x > paddle.x - 3 && ball.x < paddle.x + 3 && !paddle.damaged) {
        if (polysIntersect(paddle.polygon, ball.polygon)) {
          ball.speed *= -1;
        } else {
          paddle.disable();
        }
      }
    }
  }

  networkCtx.lineDashOffset = -time / 50;

  if (bestPaddle) {
    Visualizer.drawNetwork(networkCtx, bestPaddle.brain);
  }

  requestAnimationFrame(animate);
}
