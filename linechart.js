

d3.csv("newdata.csv").then((data) => {
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
  const color = d3.scaleOrdinal(d3.schemeCategory20);

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

  function updateChart(selectedCountry) {
    // Filter data to return only the selected country
    let filteredData = data.filter(d => d["Country Name"] === selectedCountry);

    // Remove the existing line (if any)
    svg.selectAll(".line").remove();

    // Draw the line for the selected country
    filteredData.forEach((countryData) => {
      const countryValues = d3.range(2010, 2024).map(year => ({ year: year, rate: countryData[year] }));

      svg
        .append("path")
        .datum(countryValues)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue") // Or use color(i) if you have a color scale
        .attr("stroke-width", 2)
        .attr("d", line);
    });
  }


  // Add Tooltip div
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // Define mouseover, mousemove, and mouseout functions
  function mouseover(event, d) {
    tooltip.transition().duration(200).style("opacity", .9);
    d3.selectAll('.line').style('opacity', 0.1);
    d3.select(this).style('stroke-width', '4').style('opacity', 1);
  }

  function mousemove(event, d, countryName) {
    tooltip.html("Country: " + countryName + "<br>Year: " + d.year + "<br>Rate: " + d.rate + "%")
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px");
  }

  function mouseout(event, d) {
    tooltip.transition().duration(500).style("opacity", 0);
    d3.selectAll('.line').style('stroke-width', '1.5').style('opacity', 1);
  }

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

    svg
      .append("path")
      .datum(countryValues)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", color(i)) // Use the color scale here
      .attr("stroke-width", 1.5)
      .attr("d", line)
      .on("mouseover", mouseover) // Add mouseover event
      .on("mousemove", (event) => mousemove(event, countryData, countryData["Country Name"])) // Add mousemove event
      .on("mouseout", mouseout); // Add mouseout event
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



  const countryNames = data.map(d => d["Unemployment rate (Percent)"]);
  color.domain(countryNames);



  // Create a legend
  // const legend = svg.selectAll(".legend")
  //   .data(color.domain())
  //   .enter().append("g")
  //   .attr("class", "legend")
  //   .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });
  // Add the legend with toggle functionality
  const legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
    .style("cursor", "pointer") // Add pointer on hover
    .on("click", function (d) {
      // Determine if current line is visible
      var active = d.active ? false : true,
        newOpacity = active ? 0 : 1;
      // Hide or show the elements based on the ID
      d3.select("#line" + d.replace(/ /g, "")).style("opacity", newOpacity);
      // Update whether or not the elements are active
      d.active = active;
    });



  // Draw legend colored rectangles
  legend.append("rect")
    .filter(function (d, i) { return i !== 0; }) // Exclude the first element
    .attr("x", width + margin.right - 150) // Adjust this value to move the rectangles outside of the chart window
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  // Draw legend text with countries name
  legend.append("text")
    .attr("x", width - 18 + 65) // Adjust this value to place the text to the right of the rectangles
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start") // Change this to "start" to left-align the text
    .style("font-family", "sans-serif")
    .style("font-size", "12px")
    .text(function (d) { return d; })
    .attr("fill", "black");

  // Add IDs to lines and legend items for toggle functionality
  svg.selectAll(".line").attr("id", function (d) {
    return "line" + d["Country Name"].replace(/ /g, "");
  });
  legend.append("text").attr("id", function (d) {
    return "legend" + d.replace(/ /g, "");
  });


});
