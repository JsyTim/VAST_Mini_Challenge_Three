var parse = d3.timeParse("%Y-%m-%d %H:%M:%S");

//cell size
var cellSize = 10;
// set the dimensions and margins of the graph
var heatMargin = {top: 30, right: 0, bottom: 50, left: 50},
	heatWidth = 1000 - heatMargin.left - heatMargin.right,
	heatHeight = 430,
	legendElementWidth = cellSize*2;
buckets = 9;


// append the svg object to the body of the page
var svgHeat = d3.select("#heatmap")
	.append("svg")
	.attr("width", heatWidth + heatMargin.left + heatMargin.right)
	.attr("height", heatHeight + heatMargin.top + heatMargin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + heatMargin.left + "," + heatMargin.top + ")");


// Build x scales and axis:
var xHeat = d3.scaleLinear()
	.range([ 0, heatWidth]);
// .padding(0.01);

// Build y scales and axis:
var yHeat = d3.scaleBand()
	.range([ heatHeight, 0]);
// .padding(0.01);

//draw axis
var xAxisHeat = d3.axisBottom(xHeat)
// .ticks(d3.timeHour.every(6))
	.tickFormat(d3.timeFormat("%m/%d %H:%m"))

var yAxisHeat = d3.axisLeft(yHeat);

//take the range of radiation values and divides by the number of colors
//assign a color for each range of values
var colors =['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']
var heatColor = d3.scaleQuantize()
// .range(["#bdb7d6", "#948DB3", "#605885", "#433B67"])
// .range(['#a50026','#d73027','#f46d43','#fdae61','#fee08b','#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837'])
	.range(colors);

// create a tooltip
var heatTip = d3.select("#heatmap")
	.append("div")
	.style("opacity", 0)
	.attr("class", "tooltip");


//
// var filelist = [];
// for ( i = 1; i < 20; i ++ )
// {
// 	var filename = "data/aggDataHeatmap/Region" + i + ".csv";
// 	filelist.push(d3.csv(filename));
// }
// datasets = [];

//Read the data
// Promise.all(filelist).then(files => {
// 	var index = 1;
// 	var alldata = [];
// 	for (i = 0; i < files.length; i ++ ){
// 		files[i].forEach(d => {
// 			d.Timestamp = parse(d.Timestamp);
// 			d.Value = +d.Value;
// 		})
// 		alldata.push(files[i]);
//
// 	}
//
// 	draw_heatmap(alldata[index-1]);
	//
	// var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
	//     .data(alldata);
	//
	// datasetpicker.enter()
	//     .append("input")
	//     .attr("value", function(d, i){ return "Dataset " + i })
	//     .attr("type", "button")
	//     .attr("class", "dataset-button")
	//     .on("click", function(d) {
	//         draw_heatmap(d);
	//     });

// });


// d3.csv("data/aggDataHeatmap/Region19.csv").then(function(data) {
//
//     data.forEach(function(d){
//         d.Timestamp = parse(d.Timestamp);
//         d.Value = +d.Value;
//     })
//     console.log(data);
//     draw_heatmap(data)
//     // debugger
// });

function draw_heatmap(data) {
	svgHeat.selectAll("*").remove();
	// Labels of row and columns
	var sensors = d3.map(data, d => d["Sensor-id"]).keys();
	var times = d3.map(data,d=>d.Timestamp).keys();
	debugger
	xHeat.domain(d3.extent(data,d=>d.Timestamp));
	// xHeat.domain(d3.extent(data, function (d) {return d.Timestamp;}));
	// xHeat.domain(times);

	yHeat.domain(sensors);
	heatColor.domain([0,d3.max(data, d => d.Value)])


	// var sensorLabels = svgHeat.selectAll(".sensorLabel")
	//     .data(sensors)
	//     .enter().append("text")
	//     .text(function (d) { return d; })
	//     .attr("x", 0)
	//     .attr("y", function (d, i) { return i * cellSize; })
	//     .style("text-anchor", "end")
	//     .attr("transform", "translate(-6," + cellSize / 1.5 + ")")
	//     .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "sensorLabel mono axis axis-sensors" : "sensorLabel mono axis"); });
	//
	// var timeLabels = svgHeat.selectAll(".timeLabel")
	//     .data(times)
	//     .enter().append("text")
	//     .text(function(d) { return d; })
	//     .attr("x", function(d, i) { return i * cellSize; })
	//     .attr("y", 0)
	//     .style("text-anchor", "middle")
	//     .attr("transform", "translate(" + cellSize / 2 + ", -6)")
	//     .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-time" : "timeLabel mono axis"); });
	//
	// var heatMap = svgHeat.selectAll(".time")
	//     .data(data,d=>(d["sensor-id"] + ":" +d.Timestamp));
	//
	// heatMap.append("title")
	// heatMap.enter().append("rect")
	//     .attr("x", function(d) { return (d.Timestamp - 1) * cellSize; })
	//     .attr("y", function(d) { return (d["Sensor-id"] - 1) * cellSize; })
	//     .attr("rx", 4)
	//     .attr("ry", 4)
	//     .attr("class", "time bordered")
	//     .attr("width", cellSize)
	//     .attr("height", cellSize)
	//     .style("fill", colors[0]);
	//
	// heatMap.transition().duration(1000)
	//     .style("fill", function(d) { return heatColor(d.Value); });
	//
	// heatMap.select("title").text(function(d) { return d.Value; });
	//
	// heatMap.exit().remove();
	//
	// //create legend
	// var legend = svgHeat.selectAll(".legend")
	//     .data([0].concat(heatColor.quantiles()), function(d) { return d; });
	//
	// legend.enter().append("g")
	//     .attr("class", "legend");
	//
	// legend.append("rect")
	//     .attr("x", function(d, i) { return legendElementWidth * i; })
	//     .attr("y", height)
	//     .attr("width", legendElementWidth)
	//     .attr("height", cellSize / 2)
	//     .style("fill", function(d, i) { return colors[i]; });
	//
	// legend.append("text")
	//     .attr("class", "mono")
	//     .text(function(d) { return "≥ " + Math.round(d); })
	//     .attr("x", function(d, i) { return legendElementWidth * i; })
	//     .attr("y", height + cellSize);
	//
	// legend.exit().remove();



	//add the squares
	svgHeat.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("class", "cell")
		.attr("x", function (d) {
			return xHeat(d.Timestamp)
		})
		.attr("y", function (d) {
			return yHeat(d["Sensor-id"]);
		})
		.attr("width", cellSize)
		.attr("height", cellSize)
		.style("fill", function (d) {
			return heatColor(d.Value)
		})
		.style("stroke-width", 1)
		.style("stroke", "black")
		.style("opacity", 0.8)
		.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.on("mouseleave", mouseleave)


	//draw x axis
	svgHeat.append("g")
		.style("font-size", 9)
		.attr("transform", "translate(0," + heatHeight + ")")
		.call(xAxisHeat)
		.selectAll('text')
		.attr('font-weight', 'normal')
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", "-.5em")
		.attr("transform", function (d) {
			return "rotate(-65)";
		});;
	// .select(".domain").remove()

	//draw y axis
	svgHeat.append("g")
		.style("font-size", 9.5)
		.call(yAxisHeat)
	;
	// .select(".domain").remove()

	// Three function that change the tooltip when user hover / move / leave a cell
	function mouseover() {
		heatTip
			.transition()
			.duration(200)
			.style("opacity", 1)
		d3.select(this)
		// .style("stroke", "black")
			.style("opacity", 0.5)
	}
	function mousemove(d) {
		heatTip
			.html("Value: " + d.Value )
			.style("left", (d3.mouse(this)[0] + 70) + "px")
			.style("top", (d3.mouse(this)[1]) + "px")
	}
	function mouseleave() {
		heatTip
			.transition()
			.duration(300)
			.style("opacity", 0)
		d3.select(this)
		// .style("stroke", "black")
			.style("opacity", 1)
	}

}

// draw_heatmap(files[0]);

// var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
//     .data(files);
//
// datasetpicker.enter()
//     .append("input")
//     .attr("value", function(d){ return "Dataset " + d })
//     .attr("type", "button")
//     .attr("class", "dataset-button")
//     .on("click", function(d) {
//         draw_heatmap(d);
//     });