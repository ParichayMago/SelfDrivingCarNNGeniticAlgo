class Balls {
  constructor(y, x = 0, speed = 3) {
    this.y = y;
    this.speed = speed;
    this.x = x + 50;
    this.radius = 10;
    this.polygon = this.#createPolygon();
  }
  update() {
    this.#move();
    this.polygon = this.#createPolygon();
  }
  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 0; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
  }
  #move() {
    this.x += this.speed;
  }
  #createPolygon() {
    const points = [];

    const numVertices = 16;

    for (let i = 0; i < numVertices; i++) {
      const angle = (Math.PI * 2 * i) / numVertices;
      const x = this.x + Math.cos(angle) * this.radius;
      const y = this.y + Math.sin(angle) * this.radius;
      points.push({ x, y });
    }

    return points;
  }
}
