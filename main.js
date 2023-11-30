d3.csv("Data.csv").then((data) => {
  // Parse the data
  data.forEach((d) => {
    for (let i = 2010; i <= 2023; i++) {
      d[i] = +d[i];
    }
  });

  // Define the dimensions of the chart
  const margin = { top: 30, right: 20, bottom: 60, left: 40 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create the SVG container for the chart
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create the scales
  const x = d3.scaleBand().range([-45, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);
  const x1 = d3.scaleLinear().range([0, width]);

  // Parse and sort the data
  data.forEach(d => {
    for (let i = 2010; i <= 2023; i++) {
      d[i] = +d[i];
    }
  });
  data.sort((a, b) => a[2023] - b[2023]); // Sort data in ascending order

  // Set the domains of the scales
  x.domain(data.map((d) => d["Unemployment rate (Percent)"]));
  y.domain([0, d3.max(data, (d) => d[2023])]);

  // Add the x-axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the y-axis
  svg.append("g").call(d3.axisLeft(y));

  //Create Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 420)
    .attr("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "20px")
    .text("Unemployment Rate by Countries in 2023");

  //Create Xlabel
  svg
    .append("text")
    .attr("x", width - 30)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "15px")
    .text("Countries");

  //Create Ylabel
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -200)
    .attr("dy", "1em")
    .style("font-family", "sans-serif")
    .style("font-size", "15px")
    .text("Unemployment Rate (Percent)");

  // Create the color scale
  const color = d3
    .scaleSequential()
    .domain([0, d3.max(data, (d) => d[2023])])
    .interpolator(d3.interpolateBlues);
  // Add the bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d["Unemployment rate (Percent)"]))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d[2023]))
    .attr("height", (d) => height - y(d[2023]))
    .attr("fill", (d) => color(d[2023]));

  // Add the lines chart






  // Define the dimensions of the second chart
  const margin2 = { top: 120, right: 20, bottom: 60, left: 200 };
  const width2 = 960 - margin2.left - margin2.right;
  const height2 = 500 - margin2.top - margin2.bottom;

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

  // Parse and sort the data for the second chart
  data.sort((a, b) => a[2023] - b[2023]); // Sort data in ascending order

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
    .attr("y", -10)
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
      .duration(1000)
      .attr("width", (d) => x2(d[selectedYear]))
      .attr("fill", (d) => color2(d[selectedYear]));
  }

  // Call updateChart once to draw the initial chart
  updateChart();

  let isVertical = false; // Add a variable to keep track of the current orientation

  function toggleOrientation() {
    isVertical = !isVertical; // Toggle the orientation

    if (isVertical) {
      // If the chart is now vertical, swap the roles of the x and y scales
      y2.range([0, width2]);
      x2.range([height2, 0]);

      // Update the bars
      svg2.selectAll(".bar")
        .transition()
        .duration(1000)
        .attr("y", (d) => x2(d[selectedYear]))
        .attr("height", (d) => height2 - x2(d[selectedYear]))
        .attr("x", (d) => y2(d["Unemployment rate (Percent)"]))
        .attr("width", y2.bandwidth());

      // Update the labels
      svg2.select(".xlabel")
        .attr("y", -10)
        .text("Countries");

      svg2.select(".ylabel")
        .attr("y", width2 + 40)
        .text("Unemployment Rate (Percent)");
    } else {
      // If the chart is now horizontal, swap the roles of the x and y scales back
      y2.range([0, height2]);
      x2.range([0, width2]);

      // Update the bars
      svg2.selectAll(".bar")
        .transition()
        .duration(1000)
        .attr("y", (d) => y2(d["Unemployment rate (Percent)"]))
        .attr("height", y2.bandwidth())
        .attr("x", 0)
        .attr("width", (d) => x2(d[selectedYear]));

      //   // Update the labels
      svg2.select(".xlabel")
        .attr("y", height2 + 40)
        .text("Unemployment Rate (Percent)");

      svg2.select(".ylabel")
        .attr("y", -10)
        .text("Countries");
    }


    // // Update the axes
    svg2.select(".x-axis").call(d3.axisBottom(x2));
    svg2.select(".y-axis").call(d3.axisLeft(y2));



  }

  // // Call toggleOrientation when the user clicks a button
  d3.select("#toggleButton").on("click", toggleOrientation);

});
