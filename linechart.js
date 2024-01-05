var svg = d3.select("#chart"),
  margin = { top: 40, right: 30, bottom: 40, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var line = d3
  .line()
  .x(function (d) {
    return x(d.year);
  })
  .y(function (d) {
    return y(d.value);
  });

svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("newdata.csv").then(function (data) {
  var keys = data.columns.slice(1);
  var parseTime = d3.timeParse("%Y");
  var countries = data
    .map(function (d) {
      return d["Unemployment rate (Percent)"];
    })
    .filter(function (d) {
      return d;
    });

  var select = d3
    .select("#countrySelect")
    .on("change", onchange)
    .selectAll("option")
    .data(countries)
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    });

  function onchange() {
    var selectedCountry = d3.select("#countrySelect").property("value");
    updateChart(selectedCountry);
  }

  function updateChart(country) {
    var countryData = keys.map(function (year) {
      return {
        year: parseTime(year),
        value: data.find(function (row) {
          return row["Unemployment rate (Percent)"] === country;
        })[year],
      };
    });

    x.domain(
      d3.extent(countryData, function (d) {
        return d.year;
      })
    );
    y.domain([
      0,
      d3.max(countryData, function (d) {
        return d.value;
      }),
    ]);

    svg.selectAll(".axis").remove();
    svg.selectAll(".line").remove();

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis axis--x")
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Rate %");

    svg.append("path").datum(countryData).attr("class", "line").attr("d", line);
  }

  updateChart(countries[0]);
});
