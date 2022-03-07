const totalCities = 20;
let cities = [];
let distances = []; //2d array where second index MUST be higher than first one
const populationSize = 10000;
let population = [];

let bestPath;
let bestDistance;

function setup() {
  createCanvas(innerWidth, innerHeight);
  cities = generateCities(totalCities);
  distances = calculateDistances(cities);
  const order = [];
  for (let i = 0; i < totalCities; i++) {
    order.push(i);
  }

  for (let i = 0; i < populationSize; i++) {
    population.push(new Order(shuffle(order)));
  }

  bestDistance = Number.POSITIVE_INFINITY;
}

function draw() {
  background(20);

  //analize current generation
  let scoreSum = 0;
  let currentBest = [];
  let currentBestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < populationSize; i++) {
    population[i].calculateDistance(distances);
    population[i].setScore(distances);
    scoreSum += population[i].score;
    if (population[i].distance < bestDistance) {
      bestDistance = population[i].distance;
      bestPath = population[i].order.slice();
    }
    if (population[i].distance < currentBestDistance) {
      currentBestDistance = population[i].distance;
      currentBest = population[i].order.slice();
    }
  }
  //normalize score
  for (let i = 0; i < populationSize; i++) {
    population[i].normalizeScore(scoreSum);
  }
  //prepare new generation
  const newPopulation = [];
  for (let i = 0; i < populationSize; i++) {
    if (random(1) < 0.5) {
      newPopulation.push(population[pickParentIndex()]);
      newPopulation[i].mutate(0.3);
    } else {
      newPopulation.push(population[i]);
      newPopulation[i].order = bestPath.slice();
      newPopulation[i].mutate(0.1);
    }
  }

  Order.strokeColor = [255, 255, 255];
  Order.show(currentBest);

  Order.strokeColor = [160, 23, 255];
  Order.show(bestPath, height / 2);
  population = newPopulation;
}

function generateCities(total) {
  const cities = [];
  for (let i = 0; i < total; i++) {
    const x = 0.05 * width + random(width * 0.9);
    const y = 0.05 * (height / 2) + random(0.9 * (height / 2));
    cities.push(createVector(x, y));
  }
  return cities;
}

function calculateDistances(cities) {
  const totalCities = cities.length;
  let distances = [];
  for (let i = 0; i < totalCities; i++) {
    const cityA = cities[i];
    distances[i] = [];
    for (let j = i + 1; j < totalCities; j++) {
      const cityB = cities[j];
      distances[i][j] = cityA.dist(cityB);
    }
  }
  return distances;
}

function pickParentIndex() {
  let r = random(1);
  let index = 0;
  while (r > 0) {
    r -= population[index].normalizedScore;
    index++;
  }

  return index - 1;
}
