// Load the data
d3.csv('Data.csv').then(data => {
  d3.json('world.geojson').then(geojson => {
    // Create the SVG
    const svg = d3.select('#map').append('svg')
      .attr('width', 960)
      .attr('height', 600);

    // Create the projection
    const projection = d3.geoNaturalEarth1()
      .scale(153)
      .translate([480, 300]);

    // Create the path generator
    const path = d3.geoPath()
      .projection(projection);

    // Bind the GeoJSON data to the path elements
    svg.selectAll('path')
      .data(geojson.features)
      .enter().append('path')
      .attr('d', path)
      .on('click', function (d) {
        // When a country is clicked, display the unemployment data for 2023
        const country = d.properties.name;
        const unemployment = data.find(row => row.country === country && row.year === '2023').unemployment;
        alert(`Unemployment in ${country} in 2023: ${unemployment}%`);
      });
  });
});