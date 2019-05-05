//This javascript is using D3.V5 library

// Width and height, height2 is for slider
var margin = {top:20, right:120, bottom: 100, left: 50},
    width = 960 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
    // bisectDate = d3.bisector( d => d.date).left;

// Set up scales
var xScale = d3.scaleTime().range([0, width]),
    yScale = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxis = d3.axisBottom(xScale)
              .tickSize(-height),
    yAxis = d3.axisLeft(yScale)
              .tickSize(-width)
              .tickFormat(d3.format(".2f"));

// Define the line
var line = d3.line()
    .x(d => xScale(d.time))
    .y(d => yScale(d.value))
    .curve(d3.curveMonotoneX)
    .defined(d => !isNaN(d.value));// Hiding line value for missing data

var svg = d3.select("#timeSeries").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create invisible rect for mouse tracking
svg.append("rect")
   .attr("width", width)
   .attr("height", height)
   .attr("x", 0)
   .attr("y", 0)
   .attr("id", "mouse-tracker")
   .style("fill", "none");

// --------------------------For slider part--------------------------
var context = svg.append("g")
                 .attr("class", "context")
                 .attr("transform", "translate(" + 0 + "," + 410 + ")");

// Append clip path for lines plotted, hiding those part out of bounds
svg.append("defs")
   .append("clipPath")
   .attr("id", "clip")
   .append("rect")
   .attr("width", width)
   .attr("height", height);
// --------------------------End slider part--------------------------

// 59 Custom colors, 50 mobile, 9 static
colorScheme =
["#C3594D","#C45853","#C5575A","#C45661","#C35668","#C1576F","#BE5876","#BB5A7C",
"#B75C82","#B25F88","#AD618E","#A66493","#A06797","#986A9B","#906D9F","#8870A1",
"#7F72A4","#7675A5","#6D78A6","#637AA6","#597CA6","#4F7EA4","#4480A3","#3A82A0",
"#2F839D","#25859A","#1A8696","#0F8791","#06878C","#038887","#068882","#0F897C",
"#198976","#228970","#2A896A","#328864","#3A885F","#418859","#498754","#50864E",
"#568549","#5D8445","#648341","#6A823D","#70813A","#767F37","#7C7E35","#827C34",
"#877A33","#8C7833","#917634","#967435","#9B7237","#9F7139","#A26F3C","#A66D3F",
"#A96B43","#AB6947","#AD684B","#AF674F"];

var color = d3.scaleOrdinal().range(colorScheme);

var filelist = [];
for ( i = 1; i < 20; i ++ )
{
  var filename = "data/AggRegid/Region" + i + ".csv";
  filelist.push(d3.csv(filename));
}

// Read data from csv file and preprocess it
Promise.all( filelist ).then( data => {
  // console.log(data[0][0]);
  var sensor = 1;
  // Use region 1 as an example
  var sensorList = Object.keys(data[sensor][0]).slice(1);
  // console.log(sensorList);

  var dataset = sensorList.map(d => {
    return {
      name: d,
      values: data[sensor].map( i => {
        return {
          time:parseTime(i["Timestamp"]),
          value:+i[d]
        }
      }),
      visible:true
    }
  });
  // console.log(dataset);

  //yMin, yMax
  var yMin = d3.min(dataset, d => d3.min(d.values, v => v.value)),
      yMax = d3.max(dataset, d => d3.max(d.values, v => v.value));

  // console.log(yMin);
  // console.log(yMax);

  xScale.domain(d3.extent(data[sensor].map(d => parseTime(d["Timestamp"]))));
  yScale.domain([yMin, yMax+100]);

  //Draw line graph
  svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

  svg.append("g")
     .attr("class", "y axis")
     .call(yAxis);

  svg.append("g")
     .append("text")
     .attr("y", 0)
     .attr("x", -4)
     .attr("dy", "0.7em")
     .style("text-anchor", "end")
     .text("cpm")
     .attr("fill", "#000000");

// Draw Line
 var lines = svg.selectAll(".line-group")
     .data(dataset)
     .enter()
     .append("g")
     .attr("clip-path", "url(#clip)")
     .attr("class", "line-group")
     .attr("id", d => "line-" + d.name);

 lines.append("path")
     .attr("class", "line")
     .attr("d", d => d.visible? line(d.values) : null)
     .style("stroke", d => getColor(d.name));

 // Draw legend
 var legendSpace = height/(dataset.length + 1);
 var legend = svg.selectAll('.legend')
     .data(dataset)
     .enter()
     .append("g")
     .attr("class", "legend")
     .attr("id", d => "leg-" + d.name);

});

function getColor(name){
  var sensor = name.split("-");
  var type = sensor[0];
  // console.log(type);
  var id = +sensor[1];
  // console.log(id);
  var result;
  if(type == "mobile") {
    result = id - 1;
  }else{
    switch(id) {
      case 1:
        result = 50;
        break;
      case 4:
        result = 51;
        break;
      case 6:
        result = 52;
        break;
      case 9:
        result = 53;
        break;
      case 11:
        result = 54;
        break;
      case 12:
        result = 55;
        break;
      case 13:
        result = 56;
        break;
      case 14:
        result = 57;
        break;
      case 15:
        result = 58;
        break;
      default:
        result = 58;
    }
  }
  return colorScheme[result];
}

//   // Add visible item index to dataSelect
//   dataSelect.add(10);
//
//   // Match a color to a country
//   color.domain(dataset.map(d => d.name));
//




//
//  // Draw focus
//   var focus = svg.append("g")
//         .attr("class", "circle")
//         .style("display", "none")
//         .attr("pointer-events", "none");
//   focus.append("circle")
//         .attr("r", 5);
//
//  // create a tooltip
//   var Tooltip = d3.select("body")
//       .append("div")
//       .style("display", "none")
//       .attr("class", "tooltip")
//
//   // Create areas variable
//   var areas;
//
//  // Draw Line
//   var lines = svg.selectAll(".line-group")
//       .data(dataset)
//       .enter()
//       .append("g")
//       .attr("clip-path", "url(#clip)")
//       .attr("class", "line-group")
//       .attr("id", d => "line-" + d.name.replace(" ", ""));
//
//   lines.append("path")
//       .attr("class", "line")
//       .attr("d", d => d.visible? line(d.values) : null)
//       .style("stroke", d => color(d.name))
//       .on("mouseover", function(d) {
//           d3.selectAll('.line').style("opacity", 0.2);
//           d3.select(this).style("opacity", 1).style("stroke-width", "2.5px");
//           d3.selectAll(".legend").style("opacity", 0.2);
//           d3.select("#leg-" + d.name.replace(" ","")).style("opacity", 1);
//
//           // Show circle
//           var x0 = xScale.invert(d3.mouse(this)[0]),
//               x1 = d3.timeYear.round(x0),
//               i = bisectDate(d.values, x1);
//           focus.attr("transform", "translate(" + xScale(x1) + "," + yScale(d.values[i].rating) + ")"); // Find position
//           focus.style("display", null);
//           focus.selectAll("circle")
//               .attr("fill", color(d.name));
//
//           // Show tooltip
//           Tooltip.style("display", null)
//               .html( "<strong>" + d.name + "</strong>" + "<br>"
//                   + " GDP Growth in " + "<strong>" + d.values[i].date.getFullYear() + "</strong> :" + "<br>"
//                   + "<strong>" + d.values[i].rating.toFixed(2) + "%" + "</strong>" )
//               .style("left", (d3.mouse(this)[0]+70) + "px")
//               .style("top", (d3.mouse(this)[1]) + "px");
//        })
//       .on("mouseout", function() {
//           d3.selectAll('.line').style("opacity", 1);
//           d3.select(this).style("stroke-width", "1.5px");
//           d3.selectAll(".legend").style("opacity", 1);
//           focus.style("display", "none");
//
//           // Hide tooltip
//           Tooltip.style("display", "none")
//        });
//
//   // Draw legend
//   var legendSpace = height/(dataset.length + 1);
//   var legend = svg.selectAll('.legend')
//       .data(dataset)
//       .enter()
//       .append("g")
//       .attr("class", "legend")
//       .attr("id", d => "leg-" + d.name.replace(" ", ""));
//
//   legend.append("rect")
//       .attr("width", 10)
//       .attr("height", 10)
//       .attr("x", width + (margin.right/3) - 25)
//       .attr("y", (d, i) => (i + 1/2) * legendSpace - 4)
//       .attr("fill", d => d.visible? color(d.name) : greyBtn)
//       .attr("class", "legend-box")
//       .on("click", (d, i) => {
//           // Show the line that has been hide
//           if(temp !== -1) {
//               d3.select("#line-" + dataset[temp].name.replace(" ", "")).attr("display", null);
//           }
//
//           d.visible = ! d.visible;
//
//           //update dataSelect set
//           if (d.visible) {
//               dataSelect.add(i);
//           }
//           else {
//               dataSelect.delete(i);
//           }
//
//           if(dataSelect.size === 2 ) {
//               d3.selectAll(".comparision-btn")
//                   .transition()
//                   .attr("opacity", 1);
//           } else {
//               if(!svg.select(".area-group").empty()) areas.remove();
//               comparision = false;
//               d3.selectAll(".comparision-btn")
//                   .transition()
//                   .attr("opacity", 0);
//           }
//
//           // Update appearance of comparision button
//           d3.select("#comparision-btn-left")
//               .transition()
//               .attr("fill", greyBtn);
//           d3.select("#comparision-btn-right")
//               .transition()
//               .attr("fill", greyBtn);
//           d3.select("#comparision-text")
//               .transition()
//               .attr("fill", "#000000");
//
//           //Update axis
//           maxY = findMaxY(dataset);
//           minY = findMinY(dataset);
//           yScale.domain([minY, maxY]);
//           svg.select(".y.axis")
//               .transition()
//               .call(yAxis);
//
//           // Update graph
//           lines.select("path")
//               .transition()
//               .attr("d", d=> d.visible? line(d.values) : null);
//           legend.select("rect")
//               .transition()
//               .attr("fill", d => d.visible? color(d.name) : greyBtn);
//          })
//       .on("mouseover", function(d) {
//           d3.select(this)
//               .transition()
//              .attr("fill", d =>color(d.name));
//          })
//          .on("mouseout", function(d) {
//            d3.select(this)
//              .transition()
//              .attr("fill", d => d.visible? color(d.name) : greyBtn);
//          });
//
//     legend.append("text")
//            .attr("x", width + (margin.right/3) - 10)
//            .attr("y", (d, i) => (i + 1/2) * legendSpace + 4 )
//            .attr("fill", greyBtn)
//            .text(d => d.name)
//            .on("click", () => {
//                light = !light;
//                if(light) {
//                    d3.select("body").style("color", "black");
//                    d3.select("body").style("background-color", "white");
//                    svg.selectAll("text").attr("fill", "black");
//                    svg.select("#comparision-text").attr("fill", comparision? "#ffffff" : "#000000");
//                } else {
//                    d3.select("body").style("color", "#bfbfbf");
//                    d3.select("body").style("background-color", "black");
//                    svg.selectAll("text").attr("fill", "#bfbfbf");
//                    svg.select("#comparision-text").attr("fill", comparision? "#ffffff" : "#000000");
//                }
//            });
//
//     // Comparision button
//     svg.append("g")
//         .attr("class", "comparision-btn")
//         .attr("opacity", "0")
//         .append("rect")
//         .attr("width", 42)
//         .attr("height", 16)
//         .attr("x", width + (margin.right/3) - 25)
//         .attr("y",(dataset.length + 1/2) * legendSpace - 7)
//         .attr("fill", greyBtn)
//         .attr("id", "comparision-btn-left");
//
//     svg.append("g")
//         .attr("class", "comparision-btn")
//         .attr("opacity", "0")
//         .append("rect")
//         .attr("width", 42)
//         .attr("height", 16)
//         .attr("x", width + (margin.right/3) +17 )
//         .attr("y",(dataset.length + 1/2) * legendSpace - 7)
//         .attr("fill", greyBtn)
//         .attr("id", "comparision-btn-right");
//
//     svg.append("g")
//         .attr("class", "comparision-btn")
//         .attr("opacity", "0")
//         .append("text")
//         .attr("class", "legend-box")
//         .attr("x", width + (margin.right/3) - 10)
//         .attr("y", (dataset.length + 1/2) * legendSpace + 4 )
//         .text("Comparison")
//         .attr("id", "comparision-text")
//         .on("click", function() {
//             comparision = !comparision;
//             d3.select(this)
//                 .transition()
//                 .attr("fill", comparision? "#ffffff" : "#000000");
//
//             d3.select("#comparision-btn-left")
//                 .transition()
//                 .attr("fill", comparision? "#91bfdb" : greyBtn);
//
//             d3.select("#comparision-btn-right")
//                 .transition()
//                 .attr("fill", comparision? "#fc8d59" : greyBtn);
//
//             if(dataSelect.size === 2 && comparision) {
//                 // Set to Array
//                 dataSelectArr = Array.from(dataSelect);
//                 // Hide the line of the first item
//                 temp = dataSelectArr[0];
//                 d3.select("#line-" + dataset[temp].name.replace(" ", "")).attr("display", "none");
//
//                 // Select date from dataset
//                 var subdata = dataSelectArr.map( i => dataset[i]);
//                 cmpdata = [(subdata[0].values.map((d, i) => {
//                     return {
//                         date: d.date,
//                         rating0:subdata[0].values[i].rating,
//                         rating1: subdata[1].values[i].rating
//                     }
//                 }))];
//
//                 areas = svg.selectAll(".area-group")
//                     .data(cmpdata)
//                     .enter(cmpdata[0])
//                     .append("g")
//                     .attr("clip-path", "url(#clip)")
//                     .attr("class", "area-group");
//                 drawComp();
//             } else {
//                 comparision = false;
//                 // Show the second item
//                 d3.select("#line-" + dataset[dataSelectArr[0]].name.replace(" ", "")).attr("display", null);
//                 areas.remove();
//             }
//         });
//
//     //For brusher of the slider bar at the bottom
//     function brushing() {
//       xScale.domain(!d3.event.selection ? xScale2.domain() : d3.event.selection.map(xScale2.invert)); // If brush is empty then reset the Xscale domain to default, if not then make it the brush extent
//       if(dataSelect.size === 2 && comparision) {
//           reDrawComp();
//       }
//       reDraw();
//     }
//
//     function brushended() {
//       if( !d3.event.sourceEvent) {
//         return; // Only transition after input;
//       }
//       if( !d3.event.selection) {
//         xScale.domain(xScale2.domain());
//       }
//       else {
//         var d0 = d3.event.selection.map(xScale2.invert),
//             d1 = d0.map(d3.timeYear.round);
//         // If empty when rounded, use floor & ceil instead.
//         if (d1[0] >= d1[1]) {
//           d1[0] = d3.timeYear.floor(d0[0]);
//           d1[1] = d3.timeYear.offset(d1[0]);
//         }
//         d3.select(this).transition().call(d3.event.target.move, d1.map(xScale2));
//         xScale.domain([d1[0], d1[1]]);
//       }
//
//       if(dataSelect.size === 2 && comparision) {
//           reDrawComp();
//       }
//       reDraw();
//     }
//
//     function reDraw() {
//         svg.select(".x.axis")
//             .transition()
//             .call(xAxis);
//
//         maxY = findMaxY(dataset);
//         minY = findMinY(dataset);
//         yScale.domain([minY, maxY]);
//
//         svg.select(".y.axis")
//             .transition()
//             .call(yAxis);
//
//         lines.select("path")
//             .transition()
//             .attr("d", d => d.visible ? line(d.values) : null);
//
//     }
//
//     function drawComp() {
//
//         areas.append("clipPath")
//             .attr("id", "clip-above")
//             .append("path")
//             .transition()
//             .attr("d", area1.y0(0));
//
//         areas.append("path")
//             .attr("class", "area above")
//             .attr("clip-path", "url(#clip-above)")
//             .transition()
//             .attr("d", area0.y0(height));
//
//         areas.append("clipPath")
//             .attr("id", "clip-below")
//             .append("path")
//             .transition()
//             .attr("d", area1.y0(height));
//
//         areas.append("path")
//             .attr("class", "area below")
//             .attr("clip-path", "url(#clip-below)")
//             .transition()
//             .attr("d", area0.y0(0));
//
//     }
//
//     function reDrawComp() {
//         areas.select("#clip-above")
//              .select("path")
//              .transition()
//              .attr("d", area1.y0(0));
//
//         areas.select(".above")
//             .transition()
//             .attr("d", area0.y0(height));
//
//         areas.select("#clip-below")
//             .select("path")
//             .transition()
//             .attr("d", area1.y0(height));
//
//         areas.select(".below")
//             .transition()
//             .attr("d", area0.y0(0));
//     }
// }); // End of read csv file.
//
// function findMaxY(data) {
//   var maxYValues = data.map( d => {
//     if (d.visible) {
//       return d3.max(d.values, value => value.rating) + 1;
//     }
//   });
//   return d3.max(maxYValues);
// }
//
// function findMinY(data) {
//   var minYValues = data.map( d => {
//     if (d.visible) {
//       return d3.min(d.values, value => value.rating) - 1;
//     }
//   });
//   return d3.min(minYValues);
// }
