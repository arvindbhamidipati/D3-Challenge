var svgWidth = 960;
var svgHeight = 500;

var margin = {
	top: 20,
	right: 40,
	bottom: 60,
	left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

/*
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXAxis = "hair_length";

  // function used for updating x-scale var upon click on axis label
  function xScale(hairData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(hairData, d => d[chosenXAxis]) * 0.8,
        d3.max(hairData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);

    return xLinearScale;

  }

  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }

  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
  }

  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "hair_length") {
      label = "Hair Length:";
    }
    else {
      label = "# of Albums:";
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
      });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    return circlesGroup;
  }
  // parse data
  hairData.forEach(function(data) {
    data.hair_length = +data.hair_length;
    data.num_hits = +data.num_hits;
    data.num_albums = +data.num_albums;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(hairData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(hairData, d => d.num_hits)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(hairData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.num_hits))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

*/

var svg = d3.select("#scatter")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("/assets/data/data.csv").then(function(data) {
	data.forEach(function(d) {
		d.health = parseFloat(d.health);
    	d.income = parseFloat(d.income);
	});

	var xLinearScale = d3.scaleLinear()
    	.domain([38000, d3.max(data, d => d.income)])
    	.range([0, width]);

	var yLinearScale = d3.scaleLinear()
    	.domain([3.5, d3.max(data, d => d.health)])
    	.range([height, 0]);

	var bottomAxis = d3.axisBottom(xLinearScale);
  	var leftAxis = d3.axisLeft(yLinearScale);

  	chartGroup.append("g")
    	.attr("transform", `translate(0, ${height})`)
    	.call(bottomAxis);

  	chartGroup.append("g")
    	.call(leftAxis);

  	var circlesGroup = chartGroup.selectAll("circle")
  		.data(data)
  		.enter()
    	.append("circle")
    	.attr("cx", d => xLinearScale(d.income))
    	.attr("cy", d => yLinearScale(d.health))
    	.attr("r", "15")
    	.attr("class", "stateCircle");
    //https://stackoverflow.com/questions/46147231/selecting-null-what-is-the-reason-behind-selectallnull-in-d3

    var circleText = chartGroup.selectAll(null)
    	.data(data)
    	.enter()
    	.append("text")
    	.attr("x", d => xLinearScale(d.income))
  		.attr("y", d => yLinearScale(d.health))
  		.attr("text-anchor", "middle")
  		.attr("alignment-baseline", "middle")
  		.style("font-size","6px")
  		.attr("class", "stateText")
  		.text(d => d.abbr);

	circlesGroup.on("click", function(data) {
		toolTip.show(data, this);
	})


	// Create axes labels
	chartGroup.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", 0 - margin.left + 40)
    	.attr("x", 0 - (height / 2))
    	.attr("dy", "1em")
    	.attr("class", "axisText")
    	.text("Lacks Healthcare (%)");

	chartGroup.append("text")
    	.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    	.attr("class", "axisText")
    	.text("Household Income (Median)");
    }).catch(function(error) {
	console.log(error);
});
