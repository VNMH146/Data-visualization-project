// Set the dimensions of the canvas / graph
var margin = { top: 30, right: 20, bottom: 30, left: 50 },
  width = 600 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleBand().range([0, width]).padding(0.1);
var y = d3.scaleLinear().range([height, 0]);

// Add the SVG element
var svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the data
d3.csv("Data.csv", function (error, data) {
  if (error) throw error;

  // Convert the value to a number
  data.forEach(function (d) {
    d.value = +d.value;
  });

  // Scale the range of the data
  x.domain(data.map(function (d) { return d.label; }));
  y.domain([0, d3.max(data, function (d) { return d.value; })]);

  // Add the bar chart
  svg.selectAll("bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.label); })
    .attr("width", x.bandwidth())
    .attr("y", function (d) { return y(d.value); })
    .attr("height", function (d) { return height - y(d.value); });

  // Add the X Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
    .call(d3.axisLeft(y));
});