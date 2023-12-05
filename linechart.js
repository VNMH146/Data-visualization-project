

d3.csv("Data.csv").then((data) => {
  // Parse the data
  data.forEach((d) => {
    for (let i = 2010; i <= 2023; i++) {
      d[i] = +d[i];
    }
  });

  // Define the dimensions of the chart
  const margin = { top: 30, right: 170, bottom: 60, left: 50 };
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
  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  // Set the domains of the scales
  x.domain([2010, 2023]); // Assuming years from 2010 to 2023
  y.domain([0, d3.max(data, (d) => d3.max(d3.values(d)))]);

  // Add the x-axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the y-axis
  svg.append("g").call(d3.axisLeft(y));

  // Create the linechart
  const line = d3
    .line()
    .x((d, i) => x(2010 + i)) // Use the index to calculate the year
    .y((d) => y(d));

  // Add the line
  // Add the country name as label
  data.forEach((countryData, i) => {
    const countryValues = [];
    for (let i = 2010; i <= 2023; i++) {
      countryValues.push(countryData[i]);
    }

    svg
      .append("path")
      .datum(countryValues)
      .attr("fill", "none")
      .attr("stroke", color(i)) // Use the color scale here
      .attr("stroke-width", 1.5)
      .attr("d", line)


    const maxCountryValue = d3.max(countryValues);

    svg
      .append("text")
      .attr("fill", color(i)) // Use the color scale here
      .attr("stroke", "none")
      .attr("x", x(2023) + 10) // Adjust the x position to be within the chart area
      .attr("y", y(maxCountryValue)) // Position based on max value
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(countryData["Country Name"]);
  });
  //Create Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 385)
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
    .text("Year");


  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -200)
    .attr("dy", "1em")
    .style("font-family", "sans-serif")
    .style("font-size", "15px")
    .text("Unemployment Rate (Percent)");




});
