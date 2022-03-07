class Order {
  constructor(order) {
    this.order = order;
    this.distance = 0;
    this.score = 0;
    this.normalizedScore = 0;
  }

  static strokeColor = [255, 0, 255, 255];

  static show(order = [], translateY = 0) {
    translate(0, translateY);
    strokeWeight(2);
    stroke(Order.strokeColor);

    noFill();
    beginShape();
    for (let i = 0; i < totalCities; i++) {
      const city = cities[order[i]];
      ellipse(city.x, city.y, 10);
      vertex(city.x, city.y);
    }
    endShape(CLOSE);
  }

  show(translateY = 0) {
    translate(0, translateY);
    strokeWeight(2);
    stroke(Order.strokeColor);
    noFill();
    beginShape();
    for (let i = 0; i < totalCities; i++) {
      const city = cities[this.order[i]];
      ellipse(city.x, city.y, 10);
      vertex(city.x, city.y);
    }
    endShape(CLOSE);
  }

  calculateDistance(distances) {
    const totalSteps = this.order.length;
    let distance = 0;
    for (let i = 0; i < totalSteps; i++) {
      const first = min(this.order[i], this.order[(i + 1) % totalSteps]);
      const second = max(this.order[i], this.order[(i + 1) % totalSteps]);
      if (first >= second) {
        console.log("an error occured");
        noLoop();
      }
      distance += distances[first][second];
    }
    this.distance = distance;
  }

  setScore() {
    this.score = 1 / pow(this.distance + 1, 2);
  }

  normalizeScore(totalScore) {
    this.normalizedScore = this.score / totalScore;
  }

  mutate(rate) {
    for (let i = 0; i < this.order.length; i++) {
      if (random(1) < rate) {
        this.swap(
          floor(random(this.order.length)),
          floor(random(this.order.length))
        );
      }
    }
  }

  swap(a, b) {
    [this.order[a], this.order[b]] = [this.order[b], this.order[a]];
  }
}
