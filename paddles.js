class Paddle {
  constructor(x, y, width, height, trafficLength, controlType) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.damaged = false;
    this.missed = false;
    this.angle = 0;

    this.speed = 2 / trafficLength;

    this.useBrain = controlType == "AI";

    this.sensor = new Sensor(this);
    this.control = new Controls();

    this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 2]);
  }

  update(traffic) {
    this.polygon = this.#createPolygon();

    for (let i = 0; i < traffic.length; i++) {
      if (
        this.y < 0 ||
        this.y > paddleCanvas.height ||
        traffic[i].x > this.x + 5
      ) {
        this.disable();
      }
    }

    if (this.damaged) {
      this.speed = 0;
    } else {
      this.#move();
    }

    this.sensor.update(traffic);
    const offsets = this.sensor.readings.map((s) =>
      s == null ? 0 : 1 - s.offset
    );
    const outputs = NeuralNetwork.feedForward(offsets, this.brain);

    if (this.useBrain) {
      this.control.up = outputs[0];
      this.control.down = outputs[1];
    }
  }

  disable() {
    this.damaged = true;
  }

  #move() {
    if (this.control.up) {
      this.y -= this.speed;
    }
    if (this.control.down) {
      this.y += this.speed;
    }
  }

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  // Export the Paddle class

  draw(ctx) {
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = "blue";
      this.sensor.draw(ctx);
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.closePath();
    ctx.fill();
  }
  static findFirstUndamaged(paddles) {
    for (const paddle of paddles) {
      if (!paddle.damaged) {
        return paddle;
      }
    }
    return null;
  }
}
