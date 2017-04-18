/* global d3 */
const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const svg = d3.select('svg');
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;

const vis = svg.append('g')
.attr('transform', `translate(${margin.left},${margin.top})`);

const weeks = 52;
const years = 90;
const firstYear = 1984;

const grid = d3.range(1, (weeks * years) + 1).map(value => ({
  id: value,
  week: value % weeks,
  year: firstYear + Math.floor(value / weeks),
}));

async function dataLoadPromise() {
  return new Promise((resolve, reject) => {
    try {
      d3.json('./data.json', resolve);
    } catch (err) {
      reject(err);
    }
  });
}

const mergeDataWithGrid = (data, _grid) => {
  const merged = [..._grid];

  data.lifePeriods.forEach((period) => {
    const startWeekIndex = ((period.start.year - firstYear) * weeks) + period.start.week;
    const endWeekIndex = ((period.end.year - firstYear) * weeks) + period.end.week;

    d3.range(startWeekIndex, endWeekIndex).forEach(index =>
      (merged[index][period.type] = period.description));
  });

  return merged;
};

const xScale = d3.scaleBand()
  .domain(d3.range(1, weeks + 1))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleBand()
  .domain(d3.range(1, years + 1))
  .range([0, height])
  .padding(0.1);

async function render() {
  const data = await dataLoadPromise();
  const mergedData = mergeDataWithGrid(data, grid);

  console.log(mergedData, grid[2]);

  vis.selectAll('rect')
    .data(grid)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(i % weeks))
    .attr('y', (d, i) => yScale(Math.floor(i / weeks)))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth());
}

render();
