// Load and parse the data
d3.csv("newdata.csv").then((data) => {
  const parseYear = d3.timeParse("%Y");
  const countries = data.map(d => d["Unemployment rate (Percent)"]);
  const years = d3.range(2010, 2024).map(d => parseYear(d.toString()));

  // Convert data to a suitable format
  let seriesData = countries.map((country, i) => {
    return {
      name: country,
      values: years.map(year => {
        return {
          year: year,
          rate: +data[i][year.getFullYear()]
        };
      })
    };
  });

  // Define dimensions and scales
  const margin = { top: 50, right: 80, bottom: 60, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const x = d3.scaleTime().domain(d3.extent(years)).range([0, width]);
  const y = d3.scaleLinear().domain([0, d3.max(seriesData, d => d3.max(d.values, v => v.rate))]).range([height, 0]);
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create the SVG container
  const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X and Y axis
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y));

  // Add X-Axis label
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Year");

  // Add Y-Axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Unemployment Rate (%)");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .text("Unemployment Rate of Developed Countries");

  // Line generator
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.rate));

  // Create Tooltip
  const tooltip1 = d3.select("body").append("div")
    .attr("class", "tooltip");

  // Create a table for country selection
  const table = d3.select("#countryTable");
  const tbody = table.append("tbody");
  const rows = tbody.selectAll("tr")
    .data(seriesData)
    .enter()
    .append("tr")
    .on("click", function (d) {
      d3.select(this).classed("selected", !d3.select(this).classed("selected"));
      updateSelection();
    });

  rows.append("td").text(d => d.name);

  // Function to update the chart
  function update(selectedCountries) {
    const filteredData = seriesData.filter(d => selectedCountries.includes(d.name));

    // Bind data
    const lines = svg.selectAll(".line")
      .data(filteredData, d => d.name);

    // Enter + update
    lines.enter()
      .append("path")
      .merge(lines)
      .attr("class", "line")
      .attr("d", d => line(d.values))
      .style("stroke", (d, i) => color(i));

    // Exit
    lines.exit().remove();

    // Remove old circles
    svg.selectAll(".dot").remove();

    // Add circles for each data point
    filteredData.forEach((countryData, index) => {
      svg.selectAll(".dot" + index)
        .data(countryData.values)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.rate))
        .attr("r", 5)
        .style("opacity", 0) // Invisible but still there for mouseover
        .on("mouseover", d => {
          tooltip1.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip1.html("Country: " + countryData.name + "<br/>Year: " + d.year.getFullYear() + "<br/>Rate: " + d.rate + "%")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", d => {
          tooltip1.transition()
            .duration(500)
            .style("opacity", 0);
        });
    });
  }

  // Update chart based on table selection
  function updateSelection() {
    const selectedCountries = [];
    table.selectAll(".selected").each(function (d) {
      selectedCountries.push(d.name);
    });
    update(selectedCountries);
  }

  function clearSelections() {
    d3.selectAll("#countryTable tr").classed("selected", false);
    update([]); // Update the chart with no data
  }

  // Event listener for the 'Clear All' button
  d3.select("#clearSelection").on("click", clearSelections);


  // Initial chart display
  update(countries.slice(0, 5)); // Display first 5 countries initially
});