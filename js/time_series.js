

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

// Define main graph line
const valueline = d3.line()
// .interpolate("basis")
    .defined(function(d) { return !isNaN(d.Value); })
    // .interpolate("cubic")
    .x(function(d) { return x(d.Timestamp); })
    .y(function(d) { return y(d.Value); })
    .curve(d3.curveMonotoneX);

// // Define zoomed line
// const valuelineZoom = d3.line()
//     .defined(function(d) { return !isNaN(d.Value); })
//     // .interpolate("cubic")
//     .x(function(d){return xZoom(d.Timestamp)})
//     .y(function(d){return yZoom(d.Value)})
//     .curve(d3.curveMonotoneX);

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
const xAxisZoom = d3.axisBottom(xZoom);
const xAxisZoomIn = d3.axisBottom(xZoom).tickSize(-heightZoom).ticks(d3.timeHour.every(6)).tickFormat( () => null );

// set brush effect
var brush = d3.brushX()
    .extent([[0,0],[width,heightZoom]])
    .on("end", brushed);

// add main graph area
var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//==================zoom area===============
// add zoomed area
var context = svg.append("g")// brushing context box container
    .attr("class", "context")
    .attr("transform", "translate(" + marginZoom.left + "," + marginZoom.top + ")");

//  add clip path for lines plotted, hiding those part out of bounds
svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);
// .attr("x", 0)
// .attr("y", 0);
//===========================================

// define tooltip
var tip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



// =====test: load data ======
d3.csv("data/SortbyRegid/Region1-MobileSensor.csv").then(function(mobile_data) {
    d3.csv("data/StaticSortbyRegid/Region1-StaticSensor.csv").then(function (static_data) {
        mobile_data.forEach(function (d) {
            d.Timestamp = parse(d.Timestamp);
            d.Value = +d.Value;
        });
        static_data.forEach(function(d){
            d.Timestamp = parse(d.Timestamp);
            d.Value = +d.Value;
        })
        draw_mobile_line(mobile_data.filter(d=>d.Value));
        draw_static_line(static_data.filter(d=>d.Value));
    });

});

// ========end test==========


// function to draw lines of static sensors
function draw_static_line(static_data){
    // Define main graph line for static sensors
    const valueline_static = d3.line()
    // .interpolate("basis")
        .defined(function(d) { return !isNaN(d.Value); })
        // .interpolate("cubic")
        .x(function(d) { return x(d.Timestamp); })
        .y(function(d) { return y(d.Value); })
        .curve(d3.curveMonotoneX);

    // Define zoomed line for static sensors
    const valuelineZoom_static = d3.line()
        .defined(function(d) { return !isNaN(d.Value); })
        // .interpolate("cubic")
        .x(function(d){return xZoom(d.Timestamp)})
        .y(function(d){return yZoom(d.Value)})
        .curve(d3.curveMonotoneX);

    // sort data by time in ascending order
    static_data.sort(function (a, b) {
        if (a.Timestamp < b.Timestamp)
            return -1;
        else if (a.Timestamp > b.Timestamp)
            return 1;
        else
            return 0;
    });

    // group the entries by sensor groups
    let newData = d3.nest().key(d => d["Sensor-id"]).entries(static_data);


    // focus.selectAll(".line").remove();
    // context.selectAll(".line").remove();

//========================= Draw main graph and zoomed area=================================


    // draw main graph lines; mouseover and mouseout effect
    focus.selectAll(".line.static").data(newData).enter().append("path")
        .attr("class", "line static")
        .attr("d", function (d) {
            return valueline_static(d.values)
        })
        .style("stroke", function (d) {
            return d.color = color(d.key);

        })
        .attr("id", function (d) {
            return 'tag_static' + d.key.replace(/\s+/g, '')
        }) // id for click effect
        .attr("clip-path", "url(#clip)")
        .on("mouseover", function (d1) {
            focus.selectAll(".line.static")
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
            tip.html("Static " + d1.key)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            focus.selectAll(".line.static")
                .style("stroke-opacity", "1")
                .style("stroke-width", 1.5)
            tip.transition()
                .duration(500)
                .style("opacity", 0)
        });

    // debugger


    // focus.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);
    //
    // focus.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis);

    // draw zoomed area and lines
    // context.selectAll(".line.static").data(newData).enter().append("path")
    //     // .attr("class", "line")
    //     .attr("d", function (d) {
    //         return valuelineZoom_static(d.values)
    //     })
    //     .style("stroke", function (d) {
    //         return d.color = color(d.key);
    //     })
    //     .attr("id", function(d){return 'tag1_static' + d.key.replace(/\s+/g, '')}) //id for click effect
    //     .attr("clip-path", "url(#clip_static)");

    // context.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + heightZoom + ")")
    //     .call(xAxisZoom);

    // context.append("g")
    //     .attr("class", "brush")
    //     .call(brush)
    //     .selectAll("rect")
    //     .attr("y", -6)
    //     .attr("height", heightZoom + 7  );
    // debugger
//======================= Add legend and mouse click effect =============================
    //spacing for the legend
    // legendSpace = width / newData.length;
    const legendSpace = (height) / (newData.length + 4);

    newData.forEach(function(d, i) {
        svg.append("text")
            .attr("x", width + margin.right + margin.left/ 2)
            // .attr("x", (legengendSpace / 2) + i * legendSpace) // spacing
            // .attr("y", (height + (margin.bottom / 2) + 15)
            .attr("y",  i * legendSpace + height )
            .attr("class", "legend")    // style the legend
            .style("fill", function () { // dynamic colors
                return d.color = color(d.key);
            })
            .on("click", function () {
                // Determine if current line is visible
                var active = d.active ? false : true,
                    newOpacity = active ? 0 : 1;
                // Hide or show the elements based on the ID
                d3.select("#tag_static" + d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                d3.select("#tag1_static" + d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.active = active;
            })
            .text("Static " + d.key);

    })

}
    // debugger
    // // select/clear all the lines
    // var toggle = true;
    // d3.select("input")
    //     .on("click", function() {
    //         d3.selectAll("path.line")
    //             .style("opacity", +(toggle = !toggle))
    //     })
    //
    //




function draw_mobile_line(mobile_data){


    // sort data by year in ascending order
    mobile_data.sort(function (a, b) {
        if (a.Timestamp < b.Timestamp)
            return -1;
        else if (a.Timestamp > b.Timestamp)
            return 1;
        else
            return 0;
    });

    // group the entries by age groups
    let newData = d3.nest().key(d => d["Sensor-id"]).entries(mobile_data);

    // Domain of the data
    x.domain(d3.extent(mobile_data, function (d) {return d.Timestamp;}));
    y.domain([0, d3.max(mobile_data, function (d) {return d.Value;})]).nice();
    // debugger

    //Domain of the zoomed data
    xZoom.domain(x.domain());
    yZoom.domain(y.domain());

    // focus.selectAll(".line").remove();
    // context.selectAll(".line").remove();

//========================= Draw main graph and zoomed area=================================
//
//     // add clip path
//     svg.append("defs").append("clipPath")
//         .attr("id", "clip")
//         .append("rect")
//         .attr("width", width)
//         .attr("height", height);
// // .attr("x", 0)
// // .attr("y", 0);

    // draw main graph and lines; mouseover and mouseout effect
    focus.selectAll(".line.mobile").data(newData).enter().append("path")
        .attr("class", "line mobile")
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
            focus.selectAll(".line.mobile")
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
            tip.html("Mobile " + d1.key)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            focus.selectAll(".line.mobile")
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
    // context.selectAll(".mobile.line").data(newData).enter().append("path")
    //     // .attr("class", "mobile line")
    //     .attr("d", function (d) {
    //         return valuelineZoom(d.values)
    //     })
    //     .style("stroke", function (d) {
    //         return d.color = color(d.key);
    //     })
    //     .attr("id", function(d){return 'tag1' + d.key.replace(/\s+/g, '')}) //id for click effect
    //     .attr("clip-path", "url(#clip)");

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + heightZoom + ")")
        .call(xAxisZoom);

    context.append("g")
        .attr("class","axis axis--grid")
        .attr("transform", "translate(0," + heightZoom + ")")
        .call(xAxisZoomIn)

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
            .text("Mobile " + d.key);

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
        .attr("dy", ".8em")
        .style("text-anchor", "end")
        .text("Value");

}


// select/clear all the lines
var toggle = true;
d3.select("input")
    .on("click", function() {
        d3.selectAll("path.line")
            .style("opacity", +(toggle = !toggle))
    })

//
function brushed() {
    x.domain(!d3.event.selection ? xZoom.domain() : d3.event.selection.map(xZoom.invert));
    focus.selectAll("path.line")
        .transition()
        .attr("d",  function(d) {return valueline(d.values)});
    //     .attr("d", function(d){
    //         return d.visible ? valueline(d.values) : null; // If d.visible is true then draw line for this d selection
    // });
    // focus.selectAll("path.static.line")
    //     .transition()
    //     .attr("d",  function(d) {return valueline_static(d.values)});
    focus.select(".x.axis").transition().call(xAxis);
    focus.select(".y.axis").transition().call(yAxis);
}


//
// function brushed() {
//     if (!d3.event.sourceEvent) return; // Only transition after input.
//     if (!d3.event.selection) return; // Ignore empty selections.
//     var d0 = d3.event.selection.map(xZoom.invert),
//         d1 = d0.map(d3.timeDay.round);
//
//     // If empty when rounded, use floor & ceil instead.
//     if (d1[0] >= d1[1]) {
//         d1[0] = d3.timeDay.floor(d0[0]);
//         d1[1] = d3.timeDay.offset(d1[0]);
//     }
//
//     d3.select(this).transition().call(d3.event.target.move, d1.map(xZoom));
// }



