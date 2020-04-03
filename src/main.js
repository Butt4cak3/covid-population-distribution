const TOTAL_POPULATION = 80000000;

const SQUARE_WIDTH = 6;
const SQUARE_MARGIN = 1;

const BACKGROUND_COLOR = "#ffffff";
const HEALTHY_COLOR = "#449944";
const RECOVERED_COLOR = "#2222dd";
const INFECTED_COLOR = "#dd1111";
const DECEASED_COLOR = "#000000";

let currentRegion;
let allStats;

document.addEventListener("DOMContentLoaded", () => {
  const region = window.location.hash
    ? window.location.hash.substr(1)
    : "Germany";

  fetchStats().then(() => {
    render(region);
  });
});

window.addEventListener("resize", () => {
  render(currentRegion);
});

function render(regionName) {
  currentRegion = regionName;
  const stats = getStats(regionName);
  stats.total = TOTAL_POPULATION;

  const canvas = document.getElementById("canvas");

  renderGraphic(canvas, stats, {
    size: SQUARE_WIDTH,
    margin: SQUARE_MARGIN,
    colors: {
      background: BACKGROUND_COLOR,
      healthy: HEALTHY_COLOR,
      recovered: RECOVERED_COLOR,
      infected: INFECTED_COLOR,
      deceased: DECEASED_COLOR
    }
  });
}

function fetchStats() {
  return fetch("data.json", {})
    .then(response => response.json())
    .then(data => {
      allStats = data;
    });
}

function getStats(regionName) {
  for (const region of allStats.data) {
    if (region.location === regionName) {
      return {
        infected: region.confirmed,
        deceased: region.deaths,
        recovered: region.recovered
      };
    }
  }

  // Region not found
  const countries = allStats.data.map(region => region.location);
  console.error("List of valid region names:", countries);
  throw new Error("Invalid region name");
}

function renderGraphic(canvas, stats, style) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new TypeError("Canvas is not an instance of HTMLCanvasElement");
  }

  const currentlyInfectedPopulation =
    stats.infected - stats.recovered - stats.deceased;
  const healthyPopulation = stats.total - stats.infected;

  const deceasedPercentage = stats.deceased / stats.total;
  const currentlyInfectedPercentage = currentlyInfectedPopulation / stats.total;
  const recoveredPercentage = stats.recovered / stats.total;
  const healthyPercentage = healthyPopulation / stats.total;

  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  const squaresPerRow = Math.floor(
    (width - style.margin) / (style.size + style.margin)
  );
  const numberOfRows = Math.floor(
    (height - style.margin) / (style.size + style.margin)
  );
  const totalSquares = squaresPerRow * numberOfRows;

  const peoplePerSquare = TOTAL_POPULATION / totalSquares;
  console.log("People per square:", peoplePerSquare);

  const deceasedSquares = Math.round(deceasedPercentage * totalSquares);
  const currentlyInfectedSquares = Math.round(
    currentlyInfectedPercentage * totalSquares
  );
  const recoveredSquares = Math.round(recoveredPercentage * totalSquares);
  const healthySquares = Math.round(healthyPercentage * totalSquares);

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = style.colors.background;
  ctx.fillRect(0, 0, width, height);

  let count = 0;
  for (let r = 0; r < numberOfRows; r++) {
    for (let c = 0; c < squaresPerRow; c++) {
      const x = c * (style.size + style.margin) + style.margin;
      const y = r * (style.size + style.margin) + style.margin;

      if (count < healthySquares) {
        ctx.fillStyle = style.colors.healthy;
      } else if (count < healthySquares + recoveredSquares) {
        ctx.fillStyle = style.colors.recovered;
      } else if (
        count <
        healthySquares + recoveredSquares + currentlyInfectedSquares
      ) {
        ctx.fillStyle = style.colors.infected;
      } else if (
        count <
        healthySquares +
          recoveredSquares +
          currentlyInfectedSquares +
          deceasedSquares
      ) {
        ctx.fillStyle = style.colors.deceased;
      } else {
        console.warn(`Square ${count} invalid`);
      }

      ctx.fillRect(x, y, style.size, style.size);
      count += 1;
    }
  }
}
