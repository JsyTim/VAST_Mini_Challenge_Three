//Initialize a map inside a div called map
var map = L.map('map',{
  zoomControl: false,
  scrollWheelZoom: false,
  dragging: false,
  attributionControl: false,
  doubleClickZoom: false
}).setView([0.11, -119.845], 11.8);

//
// var info = L.control();
// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };
// // method that we will use to update the control based on feature properties passed
// info.
//
// update = function (props) {
//     this._div.innerHTML = '<h4>Detailed Information</h4>' +
//         //ternary
//         (props ?
//         //if hovering on a district
//           "District: " + props.Region
//         //if not hovering on a district
//         : 'Hover over a district');
// };
// //add info to map
// info.addTo(map);

var geojson;

var style_override = {};
var style_target = function(f) { return f.properties.Id};
function merge_styles(base, new_styles){
    for (var attrname in new_styles) { base[attrname] = new_styles[attrname]; }
    return base;
}


//set color palatte
function getColor(d) {
  // return   d > 80  ? '#006d2c' :
  //          d > 60  ? '#2ca25f' :
  //          d > 40  ? '#66c2a4' :
  //          d > 20  ? '#99d8c9' :
  //          d > 0   ? '#ccece6' : '#edf8fb'
  return d == '1' ? '#FFB6C1':
         d == '2' ? '#DA70D6':
         d == '3' ? '#FFFF00':
         d == '4' ? '#EE82EE':
         d == '5' ? '#FFE4B5':
         d == '6' ? '#87CEFA':
         d == '7' ? '#006d2c':
         d == '8' ? '#FFD700':
         d == '9' ? '#BA55D3':
         d == '10' ? '#00FFFF':
         d == '11' ? '#FFA500':
         d == '12' ? '#FFC0CB':
         d == '13' ? '#1E90FF':
         d == '14' ? '#87CEEB':
         d == '15' ? '#6495ED':
         d == '16' ? '#7FFFAA':
         d == '17' ? '#F0E68C':
         d == '18' ? '#DAA520':
         d == '19' ? '#FA8072': '#edf8fb'
};

//attach color palatte to category
function style(feature, color) {
    var target = style_target(feature);
    console.log(target);
    var fillColor = (!color) ? getColor(target) : color;
    console.log(fillColor);
    // var fillColor = fillColor;
    var default_style = {
        fillColor: fillColor,
        weight: 0.8,
        opacity: 1,
        color: 'grey',
        fillOpacity: 1
    };
    return merge_styles(default_style, style_override);
};

L.geoJson(districts).addTo(map);

function highlightFeature(e) {
    var layer = e.target;
    //on hover change color from what was defined in function style(feature)
    style_override = {
        weight: 1,
        fillColor:"grey",
        fillOpacity: 0.4
    }
    geojson.resetStyle(e.target);

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

     //on hover change infobox
    // info.update(layer.feature.properties);
}

//reset highlight when hovering out
function resetHighlight(e) {
    style_override = {};
    geojson.resetStyle(e.target);
    // info.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

var geojson = L.geoJson(districts, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


var region1 = [0.18623, -119.97];
var region2 = [0.195, -119.92851];
var region3 = [0.21, -119.87285];
var region4 = [0.18326, -119.81];
var region5 = [0.128, -119.93];
var region6 = [0.153, -119.925];
var region7 = [0.11, -119.725];
var region8 = [0.045, -119.755];
var region9 = [0.055, -119.845];
var region10 = [0.055, -119.79];
var region11 = [0.075, -119.76];
var region12 = [0.12, -119.76];
var region13 = [0.115, -119.805];
var region14 = [0.16, -119.869];
var region15 = [0.16, -119.895];
var region16 = [0.132, -119.895];
var region17 = [0.09, -119.842];
var region18 = [0.135, -119.84];
var region19 = [0.13, -119.87];

var regionLabel1 = L.marker(region1, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '1 Palace Hills'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel2 = L.marker(region2, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '2 Northwest'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel3 = L.marker(region3, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '3 Old Town'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel4 = L.marker(region4, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '4 Safe Town'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel5 = L.marker(region5, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '5 Southwest'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel6 = L.marker(region6, {
  icon: L.divIcon({
      className: 'text-labels6',   // Set class for CSS styling
      html: '6 Downtown'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel7 = L.marker(region7, {
  icon: L.divIcon({
      className: 'text-labels7',   // Set class for CSS styling
      html: '7 Wilson Forest'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel8 = L.marker(region8, {
  icon: L.divIcon({
      className: 'text-labels8',   // Set class for CSS styling
      html: '8_Scenic-Vista'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel9 = L.marker(region9, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '9 Broadview'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel10 = L.marker(region10, {
  icon: L.divIcon({
      className: 'text-labels10',   // Set class for CSS styling
      html: '10 Chapparal'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel11 = L.marker(region11, {
  icon: L.divIcon({
      className: 'text-labels11',   // Set class for CSS styling
      html: '11 Terrapin Springs'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel12 = L.marker(region12, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '12 Pepper Mill'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel13 = L.marker(region13, {
  icon: L.divIcon({
      className: 'text-labels13',   // Set class for CSS styling
      html: '13 Cheddar-ford'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel14 = L.marker(region14, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '14 Easton'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel15 = L.marker(region15, {
  icon: L.divIcon({
      className: 'text-labels15',   // Set class for CSS styling
      html: '15 Weston'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel16 = L.marker(region16, {
  icon: L.divIcon({
      className: 'text-labels16',   // Set class for CSS styling
      html: '16 Southton'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel17 = L.marker(region17, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '17_Oak Willow'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel18 = L.marker(region18, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '18 East Parton'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);

var regionLabel19 = L.marker(region19, {
  icon: L.divIcon({
      className: 'text-labels',   // Set class for CSS styling
      html: '19 West Parton'
  }),
  draggable: false,
  zIndexOffset: 1000     // Make appear above other map features
}).addTo(map);
