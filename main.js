/* global d3 */
const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const svg = d3.select('svg');
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;

const vis = svg.append('g')
.attr('transform', `translate(${margin.left},${margin.top})`);

const colors = {
  darkblue: d3.color('#121A24'),
  lightblue: d3.color('#314150'),
  green: d3.color('#3E5925'),
  brown: d3.color('#8D7871'),
  lightskin: d3.color('#DBC6C4'),
};

const weeks = 52;
const years = 90;
const firstYear = 1984;

const grid = d3.range(1, (weeks * years) + 1).map(value => ({
  id: value,
  week: (value % weeks) === 0 ? 52 : (value % weeks),
  year: firstYear + Math.floor(value / weeks),
}));

const getWeek = (date) => {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

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
  const now = new Date();
  const currentWeekIndex = ((now.getFullYear() - firstYear) * weeks) + getWeek(now);

  merged[currentWeekIndex].currentWeek = true;

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
  .domain(d3.range(0, years + 1))
  .range([0, height])
  .padding(0.1);

const renderTooltip = (d, i, nodes) => {
  const anchorBounding = nodes[i].getBoundingClientRect();

  const tooltip = d3.select('#tooltip');
  tooltip
    .transition()
    .duration(200)
    .style('opacity', 0.9);
  tooltip
    .html(`<b>${d.year} CW${d.week} at age: ${d.year - firstYear}</b><br> ${d.education ? d.education : ''}`)
    .style('left', `${anchorBounding.left - 100}px`)
    .style('bottom', `${document.body.offsetHeight - anchorBounding.top - 250}px`);
};

const hideTooltip = () => {
  d3.select('#tooltip')
    .transition()
    .duration(200)
    .style('opacity', 0);
};

async function render() {
  const data = await dataLoadPromise();
  const mergedData = mergeDataWithGrid(data, grid);
  const colorScale = d3.scaleOrdinal()
    .domain(data.lifePeriods.map(period => period.description))
    .range(d3.range(data.lifePeriods.length).map(
      index => colors.lightblue.brighter(index)),
    );

  vis.selectAll('rect')
    .data(mergedData)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.week))
    .attr('y', d => yScale(Math.ceil(d.id / weeks)))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .style('fill', d => (d.education ? colorScale(d.education) : colors.darkblue))
    .style('stroke', d => (d.currentWeek ? 'white' : undefined))
    .on('mouseover', renderTooltip)
    .on('mouseout', hideTooltip);
}

render();
