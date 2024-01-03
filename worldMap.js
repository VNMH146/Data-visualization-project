// Set the dimensions of the map
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Define the projection for the map
var projection = d3.geoAitoff()
    .scale(width / 1.4 / Math.PI)
    .translate([width / 2.5, height / 2]);

// Create a tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Define zoom functionality
var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var g = svg.append("g")
    .attr("class", "countries")
    .call(zoom);

var clickedCountry = null;
var geoData; // Global variable to hold the GeoJSON data

function zoomed() {
    g.attr("transform", d3.event.transform);
}

function searchAndZoom() {
    var countryName = document.getElementById('countrySearch').value;
    var countryFeature = geoData.features.find(d => d.properties.name.toLowerCase() === countryName.toLowerCase());

    if (countryFeature) {
        // Reset any previous highlights
        d3.selectAll('.highlighted').classed('highlighted', false);

        // Zoom to the country
        zoomToCountry(countryFeature);

        // Highlight the country in green for 1 second
        var countryPath = d3.selectAll('path')
            .filter(function (d) { return d.properties.name === countryFeature.properties.name; });

        countryPath.classed('highlighted', true)
            .style('fill', 'green');

        setTimeout(function () {
            countryPath.classed('highlighted', false)
                .style('fill', function (d) {
                    var country = unemploymentData.find(c => c.Country === d.properties.name);
                    return country ? colorScale(country[selectedYear]) : "#ccc";
                });
        }, 100);

    } else {
        alert("Country not found!");
    }
}


// Function to update the map based on selected year
function updateVisualizationForYear(year, unemploymentData) {
    g.selectAll("path")
        .style("fill", function (d) {
            var country = unemploymentData.find(c => c.Country === d.properties.name);
            return country ? colorScale(country[year]) : "#ccc";
        });
}

// Color scale for unemployment rates
var colorScale = d3.scaleSequential(d3.interpolateReds)
    .domain([0, 20]); // Assuming max unemployment rate is 20%

// Load both GeoJSON and CSV data
d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "newdata.csv", function (d) {
        return {
            Country: d['Unemployment rate (Percent)'],
            ...d
        };
    })
    .await(ready);

function ready(error, worldGeoJSON, unemploymentData) {
    if (error) throw error;
    geoData = worldGeoJSON;

    // Draw the map with GeoJSON data
    g.selectAll("path")
        .data(geoData.features)
        .enter().append("path")
        .attr("d", d3.geoPath().projection(projection))
        .style("fill", function (d) {
            var country = unemploymentData.find(c => c.Country === d.properties.name);
            return country ? colorScale(country[selectedYear]) : "#ccc";
        })
        .style("stroke", "#fff")
        .on("mouseover", function (d) {
            // Brighten the country's color
            d3.select(this).style("fill", function (d) {
                return d3.interpolateRgb(this.style.fill, "#ffffff")(0.2);
            });

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            var countryData = unemploymentData.find(c => c.Country === d.properties.name);
            var tooltipText = countryData ? `${d.properties.name}: ${countryData[selectedYear]}%` : d.properties.name;
            tooltip.html(tooltipText)
                .style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            // Reset the country's color
            d3.select(this).style("fill", function (d) {
                var country = unemploymentData.find(c => c.Country === d.properties.name);
                return country ? colorScale(country[selectedYear]) : "#ccc";
            });

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (d) {
            if (clickedCountry === d) {
                resetZoom();
            } else {
                zoomToCountry(d);
            }
        });

    // Slider for year selection
    var selectedYear = 2010; // Default year
    d3.select("#yearInput").on("input", function () {
        selectedYear = +this.value;
        d3.select("#yearDisplay").text(selectedYear);
        updateVisualizationForYear(selectedYear, unemploymentData);
    });

    // Initial update of the map
    updateVisualizationForYear(selectedYear, unemploymentData);
}

function zoomToCountry(d) {
    var bounds = d3.geoPath().projection(projection).bounds(d);
    var dx = bounds[1][0] - bounds[0][0];
    var dy = bounds[1][1] - bounds[0][1];
    var x = (bounds[0][0] + bounds[1][0]) / 2;
    var y = (bounds[0][1] + bounds[1][1]) / 2;
    var scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
    var translate = [width / 2 - scale * x, height / 2 - scale * y];

    g.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));

    clickedCountry = d;

    d3.selectAll('path')
        .filter(function (p) { return p === d; })
        .classed('highlighted', true)
        .style('fill', 'green');

    setTimeout(function () {
        d3.selectAll('path')
            .filter(function (p) { return p === d; })
            .classed('highlighted', false)
            .style('fill', function (d) {
                var country = unemploymentData.find(c => c.Country === d.properties.name);
                return country ? colorScale(country[selectedYear]) : "#ccc";
            });
    }, 100);
}

function resetZoom() {
    g.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    clickedCountry = null;
}
