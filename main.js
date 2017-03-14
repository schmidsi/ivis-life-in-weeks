/* global d3 */
const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const svg = d3.select('svg');
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;


const vis = svg.append('g')
.attr('transform', `translate(${margin.left},${margin.top})`);

const weeks = 52;
const years = 10;

const data = d3.range(1, weeks * years);

const xScale = d3.scaleBand()
  .domain(d3.range(1, weeks + 1))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleBand()
  .domain(d3.range(1, years + 1))
  .range([0, height])
  .padding(0.1);

vis.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', (d, i) => xScale(i % weeks))
  .attr('y', (d, i) => Math.floor(yScale(i / years)))
  .attr('width', xScale.bandwidth())
  .attr('height', yScale.bandwidth());

console.log(data);
