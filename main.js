
d3.csv("newdata.csv").then((data) => {
  // Parse the data
  data.forEach((d) => {
    for (let i = 2010; i <= 2023; i++) {
      d[i] = +d[i];
    }
  });

  // Define the dimensions of the second chart
  const margin2 = { top: 50, right: 20, bottom: 50, left: 150 };
  const width2 = 990 - margin2.left - margin2.right;
  const height2 = 700 - margin2.top - margin2.bottom;

  // Create the SVG container for the second chart
  const svg2 = d3
    .select("#chart2")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  // Create the scales for the second chart
  const y2 = d3.scaleBand().range([0, height2]).padding(0.1);
  const x2 = d3.scaleLinear().range([0, width2]);

  // Set the domains of the scales for the second chart
  y2.domain(data.map((d) => d["Unemployment rate (Percent)"]));
  x2.domain([0, d3.max(data, (d) => d[2023])]);

  // Add the y-axis for the second chart
  svg2
    .append("g")
    .call(d3.axisLeft(y2));

  // Add the x-axis for the second chart
  svg2
    .append("g")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(x2));

  // Create the title for the second chart
  svg2
    .append("text")
    .attr("x", width2 / 2)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "20px")
    .text("Unemployment Rate by Countries from 2010 to 2023");

  // Create the xlabel for the second chart
  svg2
    .append("text")
    .attr("x", width2 / 2)
    .attr("y", height2 + 40)
    .attr("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "15px")
    .text("Unemployment Rate (Percent)");

  // Create the ylabel for the second chart
  svg2
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin2.left)
    .attr("x", -height2 / 2)
    .attr("dy", "1em")
    .style("font-family", "sans-serif")
    .style("font-size", "15px")
    .text("Countries");

  // Create the color scale for the second chart
  const color2 = d3
    .scaleSequential()
    .domain([0, d3.max(data, (d) => d[2023])])
    .interpolator(d3.interpolateBlues);

  // Add the bars for the second chart
  svg2
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", (d) => y2(d["Unemployment rate (Percent)"]))
    .attr("height", y2.bandwidth())
    .attr("x", 0)
    .attr("width", (d) => x2(d[2023]))
    .attr("fill", (d) => color2(d[2023]));

  // Populate the dropdown with years
  const years = d3.range(2010, 2024);
  const select = d3.select("#yearSelect", "yearSelect1");
  select
    .selectAll('option')
    .data(years)
    .enter()
    .append('option')
    .text(d => d);

  // Set initial year
  let selectedYear = 2010;

  // Update chart when dropdown selection changes
  select.on("change", function () {
    selectedYear = +this.value;
    updateChart();
  });

  function updateChart() {
    // Update the x scale domain
    x2.domain([0, d3.max(data, (d) => d[selectedYear])]);

    // Update the color scale domain
    color2.domain([0, d3.max(data, (d) => d[selectedYear])]);

    // Update the bars
    svg2.selectAll(".bar")
      .data(data)
      .transition() // Add a transition to animate the changes
      .duration(2000)
      .attr("width", (d) => x2(d[selectedYear]))
      .attr("fill", (d) => color2(d[selectedYear]));
  }

  // Call updateChart once to draw the initial chart
  updateChart();
});