const margin = {top: 50, right: 50, bottom: 50, left: 50};

const svg = d3.select("svg");
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;

// content area of your visualization (note: g elements do NOT have dimensions)
const vis = svg.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

// Everything below is for illustration purposes
// delete it and replace it with your own visualization (by appending to `vis`)

// -- ▼ DELETE FROM HERE ▼ --

// illustrate content area dimensions (makes container g element grow accordingly)
const rect = vis.append("rect")
.attr("class", "content")
.attr("width", width)
.attr("height", height);

// illustrate left/right margins
const xScale = d3.scaleLinear()
.domain([margin.left, margin.left + width])
.range([0, width]);
vis.append("g").call(d3.axisTop(xScale));

// illustrate top/bottom margins
const yScale = d3.scaleLinear()
.domain([margin.top, margin.top + height])
.range([0, height]);
vis.append("g").call(d3.axisLeft(yScale));

// Tip: name your selections and work with CSS classes
const label = vis.append("g")
.attr("class", "label");

const data = ["Content", "Area"];

label.selectAll("text")
.data(data)
.enter()
.append("text")
.text(d => d)
.attr("x", width / 2)
.attr("y", (d, i) => height / 2 + (i * 20))
.attr("text-anchor", "middle");

// -- ▲ DELETE UNTIL HERE ▲ --