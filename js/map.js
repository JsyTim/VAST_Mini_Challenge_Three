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
  return d == '1' ? '#FFB6C1':
         d == '2' ? '#DA70D6':
         d == '3' ? '#FFFF00':
         d == '4' ? '#EE82EE':
         d == '5' ? '#FFE4B5':
         d == '6' ? '#87CEFA':
         d == '7' ? '#66c2a4':
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
    var fillColor = (!color) ? getColor(target) : color;
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


// add region_Name label
//
// location of different regions
var regionList = [[0.18, -119.97], [0.185, -119.928], [0.193, -119.87], [0.18, -119.81],  [0.12, -119.93], [0.153, -119.925], [0.11, -119.727], [0.045, -119.755], [0.058, -119.845], [0.055, -119.79], [0.075, -119.769], [0.12, -119.76], [0.115, -119.805], [0.16, -119.869], [0.16, -119.895], [0.132, -119.895], [0.09, -119.842], [0.13, -119.84], [0.13, -119.87]];

var regionName = ['1 Palace Hills', '2 Northwest', '3 Old Town', '4 Safe Town', '5 Southwest', '6 Downtown', '7 Wilson Forest', '8_Scenic-Vista', '9 Broadview', '10 Chapparal', '11 Terrapin Springs', '12 Pepper Mill', '13 Cheddar-ford', '14 Easton', '15 Weston', '16 Southton', '17_Oak Willow', '18 East Parton', '19 West Parton'];

for(i = 0; i < 19; i++){
    window["regionLabel" + i] = L.marker(regionList[i], {
    icon: L.divIcon({
        className: 'text-labels',   // Set class for css styling
        html: regionName[i]
    }),
    draggable: false,
    zIndexOffset: 1000     // Make appear above other map features
    }).addTo(map);
}

// add hospital
hospitalList = [[0.180960, -119.959400], [0.153120, -119.915900], [0.151090, -119.909520], [0.121800, -119.904300], [0.134560, -119.883420], [0.182990, -119.855580], [0.041470, -119.828610], [0.065250, -119.744800]];

var hospitalIcon = L.icon({
    iconUrl:'data/icon/hospital.svg',
    iconSize: [25, 30], // size of the icon
    popupAnchor: [0, -12] // point from which the popup should open relative to the iconAnchor
});
for(i = 0; i < 8; i++){
  window["hospitalLabel" + i] = L.marker(hospitalList[i], {icon: hospitalIcon}).addTo(map).bindPopup('<b>This is a Hospital.</b>');
}

// add radiation station
var radiationIcon = L.icon({
    iconUrl:'data/icon/radiation.svg',
    iconSize: [30, 35], // size of the icon
    popupAnchor: [0, -12] // point from which the popup should open relative to the iconAnchor
});
var nuclear = L.marker([0.162679, -119.784825], {icon: radiationIcon}).addTo(map).bindPopup('<b>The Always Safe Nuclear plant.</b>');
map.addLayer(nuclear);

//add sensor route
console.log(sensorRoute.length)
// for(i = 0; i < sensorRoute.length; i++){

// }
