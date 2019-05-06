
//cell size
var cellSize = 10;

// set the dimensions and margins of the graph
var heatMargin = {top: 30, right: 0, bottom: 50, left: 50},
	heatWidth = 1000 - heatMargin.left - heatMargin.right,
	heatHeight = cellSize * 10;

// append the svg object to the body of the page
var svgHeat = d3.select("body")
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

var heatColor = d3.scaleQuantize()
// .range(["#bdb7d6", "#948DB3", "#605885", "#433B67"])
// .range(['#a50026','#d73027','#f46d43','#fdae61','#fee08b','#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837'])
	.range(['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']);

// create a tooltip
var heatTip = d3.select("#heatmap")
	.append("div")
	.style("opacity", 0)
	.attr("class", "tooltip");


//Read the data
d3.csv("data/newfile_heatmap.csv").then(function(data) {

	data.forEach(function(d){
		d.Timestamp = parse(d.Timestamp);
		d.Value = +d.Value;
	})
	draw_heatmap(data)

});

function draw_heatmap(data) {

	// Labels of row and columns
	var sensors = d3.map(data, d => d["Sensor-id"]).keys();
	var times = d3.map(data,d=>d.Timestamp).keys();
	debugger
	xHeat.domain(d3.extent(data,d=>d.Timestamp));
	// xHeat.domain(d3.extent(data, function (d) {return d.Timestamp;}));
	// xHeat.domain(times);

	yHeat.domain(sensors);
	heatColor.domain(d3.extent(data, d => d.Value))

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
		.style("font-size", 8)
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
		.style("font-size", 8)
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
















//
    // d3.json("data/test.json", function(error, data) {
	//     if (error) return console.warn(error);
	//
	//     var xAxisName = "State";
	//     var yAxisName = "Denomination";
	//     var value = "Percent";
	//     var xAxisArray = [];
	//     var yAxisArray = [];
	//     var dataArray = [];
	//     var valueArray = [];
	//     var truncY = [];
	//     var truncX = [];
	//
	//     for (var i =0; i<data.length; i++) {
	//       xAxisArray.push(data[i][xAxisName]);
	//       yAxisArray.push(data[i][yAxisName]);
	//       var round = (Math.round(data[i][value] * 100) / 100);
	// 	  valueArray.push(data[i][value]);
	//       //This array stores the values as numbers
	//       dataArray.push({yAxis: data[i][yAxisName], Value: round, xAxis: data[i][xAxisName], xAxisName: data[i][xAxisName], yAxisName: data[i][yAxisName]});
	//     };
	//     xAxisArray = _.uniq(xAxisArray);
	//     yAxisArray = _.uniq(yAxisArray);
	//     xAxisArray = xAxisArray.sort();
	//     yAxisArray = yAxisArray.sort();
	//
	//     /* Assign each name a number and place matrix coordinates inside of dataArray */
	//     for (var i = 0; i<dataArray.length;i++) {
	//       for (var j = 0; j<xAxisArray.length; j++) {
    //   		if (xAxisArray[j] == dataArray[i].xAxis) {
    //   		  dataArray[i].xAxis = j;
    //   		}
	//       }
	//       for (var j = 0; j<yAxisArray.length; j++) {
    //   		if (yAxisArray[j] == dataArray[i].yAxis) {
    //   		  dataArray[i].yAxis = j;
    //   		}
	//       }
	//     };
	//
	//     /* Truncate Values */
	//     for (var i = 0; i < yAxisArray.length; i++) {
	//       if (yAxisArray[i].length > 20) {
    //   		truncY.push(yAxisArray[i].substring(0, 20) + '...');
    //   	      } else {
    //   		truncY.push(yAxisArray[i]);
	//       }
	//     }
	//
	//     for (var i = 0; i < xAxisArray.length; i++) {
	//       if (xAxisArray[i].length > 30) {
    //   		truncX.push(xAxisArray[i].substring(0, 30) + '...');
    //   	      } else {
    //   		truncX.push(xAxisArray[i]);
	//       }
	//     }
	//
	//     var margin = { top: 150, right: 100, bottom: 100, left: 100 },
	//     xAxisData = xAxisArray,
	//     yAxisData = yAxisArray
	//     gridSize = 25;
	//
	//     var width = xAxisData.length * gridSize,
	//     height = yAxisData.length * gridSize,
	//     legendWidth = 50,
	//     buckets = 9,
	//     colors = ["#FFFFCC","#FFEDA0","#FED976","#FEB24C","#FD8D3C","#FC4E2A","#E31A1C","#BD0026","#800026"];
	//
	//     //color selection
	//
	//     var colorScale = d3.scale.quantile()
	// 	    .domain(valueArray)
	// 	    .range(colors);
	//
	//    var svg = d3.select("#heatmap").append("svg")
	// 	.attr("width", width + margin.left + margin.right)
	// 	.attr("height", height + margin.top + margin.bottom)
	// 	.append("g")
	// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	//
	//
    // var yAxis = svg.selectAll(".yAxis")
	// 	.data(truncY)
	// 	.enter().append("text")
	// 	.text(function (d) { return d; })
	// 	.attr("x", 0)
	// 	.attr("y", function (d, i) { return i * gridSize; })
	// 	.style("text-anchor", "end")
	// 	.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
	// 	.attr("class", "yAxis");
	//
	//
    // var xAxis = svg.selectAll(".xAxis")
	// 	.data(truncX)
	// 	.enter().append("svg:g")
	// 	xAxis.append("text")
	// 	.text(function(d) { return d; })
	// 	.style("text-anchor", "start")
	// 	.attr("x", 6)
	// 	.attr("y", 7)
	// 	.attr("class", "xAxis")
	// 	.attr("transform", function(d, i) { return "translate(" + i * gridSize + ", -6)rotate(-45)" });
	//
	//     /* Initialize tooltip */
	//     var tip = d3.tip()
	//       .attr('class', 'd3-tip')
	//       .html(function(d) { return "<div> <span class='light'>" + value + ":</span> " + d.Value + "</div>" + "<div><span class='light'>" + xAxisName + ":</span> " + d.xAxisName + "</div>" + "<div> <span class='light'>" + yAxisName + ": </span>" + d.yAxisName + "</div>"; })
	//
	// 	   var heatMap = svg.selectAll(".heat")
	// 	  .data(dataArray)
	// 	  .enter().append("rect")
	// 	  .attr("x", function(d) { return (d.xAxis) * gridSize; })
	// 	  .attr("y", function(d) { return (d.yAxis) * gridSize; })
	// 	  .attr("rx", 2)
	// 	  .attr("ry", 2)
	// 	  .attr("class", "heat bordered")
	// 	  .attr("width", gridSize)
	// 	  .attr("height", gridSize)
	// 	  .style("fill", colors[0])
	// 	.on('mouseover', tip.show)
	// 	.on('mouseout', tip.hide)
	// 	.transition()
	// 	.duration(1000)
	// 	.style("fill", function(d) { return colorScale(d.Value); });
	//
	//     /* Invoke the tooltip in the context of your visualization */
	//     heatMap.call(tip);
	//
	//     //vertical lines
	//   svg.selectAll(".vline").data(d3.range(xAxisData.length + 1)).enter()
	// 	.append("line")
	// 	.attr("x1", function (d) {
	// 	return d * gridSize;
	//     })
	// 	.attr("x2", function (d) {
	// 	return d * gridSize;
	//     })
	// 	.attr("y1", function (d) {
	// 	return 0;
	//     })
	// 	.attr("y2", function (d) {
	// 	return height;
	//     })
	// 	.style("stroke", "#eee");
	//
	//     // horizontal lines
	//     svg.selectAll(".hline").data(d3.range(yAxisData.length + 1)).enter()
	// 	.append("line")
	// 	.attr("y1", function (d) {
	// 	return d * gridSize;
	//     })
	// 	.attr("y2", function (d) {
	// 	return d * gridSize;
	//     })
	// 	.attr("x1", function (d) {
	// 	return 0;
	//     })
	// 	.attr("x2", function (d) {
	// 	return width;
	//     })
	// 	.style("stroke", "#eee");
	//
	//
	//   //heatMap.append("title").text(function(d) { return d.Value; });
	//
	//   var legend = svg.selectAll(".legend")
	//       .data([0].concat(colorScale.quantiles()), function(d) { return d; })
	//       .enter().append("g")
	//       .attr("class", "legend");
	//
	//   legend.append("rect")
	//     .attr("x", function(d, i) { return legendWidth * i; })
	//     .attr("y", yAxisData.length * gridSize + 40)
	//     .attr("width", legendWidth)
	//     .attr("height", 20);
	//
	//   legend.style("fill", function(d, i) { return colors[i]; });
	//
	//   legend.append("text")
	//     .text(function(d) { return "" + Math.round(d * 100) / 100+ "%"; })
	//     .attr("x", function(d, i) { return legendWidth * i; })
	//     .attr("y", yAxisData.length * gridSize + 75);
	//
    //  });
