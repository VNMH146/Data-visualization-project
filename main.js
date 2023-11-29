d3.csv("Data.csv").then(data => {
  // Parse the data
  data.forEach(d => {
    for (let i = 2010; i <= 2023; i++) {
      d[i] = +d[i];
    }
  });

  // Define the dimensions of the chart
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create the SVG container for the chart
  const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create the scales
  const x = d3.scaleBand().range([-45, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  // Set the domains of the scales
  x.domain(data.map(d => d["Unemployment rate (Percent)"]));
  y.domain([0, d3.max(data, d => d[2023])]);

  // Add the x-axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the y-axis
  svg.append("g")
    .call(d3.axisLeft(y));


  // Create the color scale
  const color = d3.scaleSequential()
    .domain([0, d3.max(data, d => d[2023])])
    .interpolator(d3.interpolateBlues);
  // Add the bars
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d["Unemployment rate (Percent)"]))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d[2023]))
    .attr("height", d => height - y(d[2023]))
    .attr("fill", d => color(d[2023]));
});