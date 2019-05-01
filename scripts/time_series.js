

// Set the dimensions of the canvas / graph
const margin = {top: 80, right: 90, bottom: 150, left: 80},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Set the dimensions of zoom area
const marginZoom = {top:500, right:90, bottom:30,left:80},
    heightZoom = 600 - marginZoom.top - marginZoom.bottom;

// Add svg canvas to the body of the page
const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
// .append("g")
// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




// Parse the Timestamp
var parse = d3.timeParse("%Y-%m-%d %H:%M:%S");

// Set the scale and ranges of main chart x and y
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Set the scale and ranges of zoomed x and y
const xZoom = d3.scaleTime().range([0, width]);
const yZoom = d3.scaleLinear().range([heightZoom, 0]);

// Define the axes
const xAxis = d3.axisBottom(x).ticks(6);
const yAxis = d3.axisLeft(y).ticks(8);
// Define zoomed x axes
const xAxisZoom = d3.axisBottom(xZoom).ticks(6);

// set brush effect
var brush = d3.brushX()
    .extent([[0,0],[width,heightZoom]])
    .on("brush", brushed);

// Define main graph line
const valueline = d3.line()
// .interpolate("basis")
    .defined(function(d) { return !isNaN(d.Value); })
    // .interpolate("cubic")
    .x(function(d) { return x(d.Timestamp); })
    .y(function(d) { return y(d.Value); })
    .curve(d3.curveMonotoneX);

// Define zoomed line
const valuelineZoom = d3.line()
    .defined(function(d) { return !isNaN(d.Value); })
    // .interpolate("cubic")
    .x(function(d){return xZoom(d.Timestamp)})
    .y(function(d){return yZoom(d.Value)})
    .curve(d3.curveMonotoneX);


// add main graph area
var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add zoomed area
var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + marginZoom.left + "," + marginZoom.top + ")");

var tip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//========================== data processing  ==================================
// Load the data
// d3.csv("data/SortbyRegid/Region1-MobileSensor.csv", function(error, data) {
    // d3.csv("data/SortbySenid/Sensor1-MobileSensor.csv", function(error, data) {

// =====test======
// var dt = d3.csv("data/SortbyRegid/Region1-MobileSensor.csv").then(function(data){
//     data.forEach(function (d) {
//     d.Timestamp = parse(d.Timestamp);
//     d.Value = +d.Value;
//     });
//     draw_timeSeries(data);
// });
// ====end test===


function draw_timeSeries(data){


    // sort data by year in ascending order
    data.sort(function (a, b) {
        if (a.Timestamp < b.Timestamp)
            return -1;
        else if (a.Timestamp > b.Timestamp)
            return 1;
        else
            return 0;
    });

    // group the entries by age groups
    let newData = d3.nest().key(item => item["Sensor-id"]).entries(data);

    // Domain of the data
    x.domain(d3.extent(data, function (d) {return d.Timestamp;}));
    y.domain([0, d3.max(data, function (d) {return d.Value;})]).nice();
    debugger

    //Domain of the zoomed data
    xZoom.domain(x.domain());
    yZoom.domain(y.domain());

    focus.selectAll(".line").remove();
    context.selectAll(".line").remove();
// add clip path
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
// .attr("x", 0)
// .attr("y", 0);

//========================= Draw main graph and zoomed area=================================
    // draw main graph and lines; mouseover and mouseout effect
    focus.selectAll("line").data(newData).enter().append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return valueline(d.values)
        })
        .style("stroke", function (d) {
            return d.color = color(d.key);

        })
        .attr("id", function (d) {
            return 'tag' + d.key.replace(/\s+/g, '')
        }) // id for click effect
        .attr("clip-path", "url(#clip)")
        .on("mouseover", function (d1) {
            focus.selectAll(".line")
                .style("stroke-opacity", function (d2) {
                    if (d1 == d2)
                        return 1;
                    else
                        return 0.15;
                })
                .style("stroke-width", function (d3) {
                    if (d1 == d3)
                        return 3;
                    else
                        return 1.5;
                })
            tip.transition()
                .duration(200)
                .style("opacity", 1.0);
            tip.html(d1.key)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            focus.selectAll(".line")
                .style("stroke-opacity", "1")
                .style("stroke-width", 1.5)
            tip.transition()
                .duration(500)
                .style("opacity", 0)
        });

    debugger

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // draw zoomed area and lines
    context.selectAll(".line").data(newData).enter().append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return valuelineZoom(d.values)
        })
        .style("stroke", function (d) {
            return d.color = color(d.key);
        })
        .attr("id", function(d){return 'tag1' + d.key.replace(/\s+/g, '')}) //id for click effect
        .attr("clip-path", "url(#clip)");

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightZoom + ")")
        .call(xAxisZoom);

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", heightZoom + 7  );

debugger
//======================= Add legend and mouse click effect =============================
    //spacing for the legend
    // legendSpace = width / newData.length;
    const legendSpace = (height) / (newData.length + 4);

    newData.forEach(function(d, i) {
        svg.append("text")
            .attr("x", width + margin.right + margin.left/ 2)
            // .attr("x", (legengendSpace / 2) + i * legendSpace) // spacing
            // .attr("y", (height + (margin.bottom / 2) + 15)
            .attr("y", ((legendSpace + margin.top)/ 2) + i * legendSpace)
            .attr("class", "legend")    // style the legend
            .style("fill", function () { // dynamic colors
                return d.color = color(d.key);
            })
            .on("click", function () {
                // Determine if current line is visible
                var active = d.active ? false : true,
                    newOpacity = active ? 0 : 1;
                // Hide or show the elements based on the ID
                d3.select("#tag" + d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                d3.select("#tag1" + d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.active = active;
            })
            .text("Sensor " + d.key);

    })

//====================== Draw x, y labels ===========================================
    // draw the title of the chart
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px");
    // .style("text-decoration","underline")
    // .text("Birth Rate for Females by Age Group: United States");

    // label for x axis
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Time");

    // label for y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left - 50)
        .attr("x", 0 - ((height+ heightZoom) / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value");


    // debugger;
    // select/clear all the lines
    var toggle = true;
    d3.select("input")
        .on("click", function() {
            d3.selectAll("path.line")
                .style("opacity", +(toggle = !toggle))
        })

// });
}

function brushed() {
    // x.domain(brush.empty() ? xZoom.domain() : brush.extent());
    x.domain(!d3.event.selection ? xZoom.domain() : d3.event.selection.map(xZoom.invert,xZoom));
    focus.selectAll(".line")
        // .attr("d",  function(d) {return valueline(d.values)});
        .attr("d",  valueline);

    focus.select(".x.axis").call(xAxis);
    focus.select(".y.axis").call(yAxis);
}


//
// function brush() {
//     if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
//     var s = d3.event.selection || x2.range();
//     x.domain(s.map(x2.invert, x2));
//     focus.select(".area").attr("d", area);
//     focus.select(".axis--x").call(xAxis);
//     svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
//         .scale(width / (s[1] - s[0]))
//         .translate(-s[0], 0));
// }
