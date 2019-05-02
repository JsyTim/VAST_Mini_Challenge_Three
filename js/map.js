//Initialize a map inside a div called map
var map = L.map('map',{
  zoomControl: false,
  scrollWheelZoom: false,
  dragging: false,
  attributionControl: false,
}).setView([0.11, -119.845], 11.8);

var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Detailed Information</h4>' +
        //ternary
        (props ?
        //if hovering on a district
          "District: " + props.Region
        //if not hovering on a district
        : 'Hover over a district');
};
//add info to map
info.addTo(map);

var geojson;

var style_override = {};
var style_target = function(f) { return f.properties.Water};
var style_item = function(f) { return 'water'};
window.onload = function(e){
    document.getElementById('change-water').click();
}
function merge_styles(base, new_styles){
    for (var attrname in new_styles) { base[attrname] = new_styles[attrname]; }
    return base;
}

//set color palatte
function getColor(d, item) {
  if(item == 'water'){
      return   d > 80  ? '#006d2c' :
               d > 60  ? '#2ca25f' :
               d > 40  ? '#66c2a4' :
               d > 20  ? '#99d8c9' :
               d > 0   ? '#ccece6' : '#edf8fb'
    }else if(item == 'help'){

      return   d > 1000 ? '#990000' :
               d > 500  ? '#d7301f' :
               d > 200  ? '#ef6548' :
               d > 100  ? '#fc8d59' :
               d > 50   ? '#fdbb84' :
               d > 20   ? '#fdd49e' :
               d > 10   ? '#fee8c8' :'#fff7ec';
    }else if(item == 'food'){

      return   d > 80  ? '#980043' :
               d > 60  ? '#dd1c77' :
               d > 40  ? '#df65b0' :
               d > 20  ? '#c994c7' :
               d > 0   ? '#d4b9da' : '#f1eef6'
    }
};


//attach color palatte to category
function style(feature, color, item) {
    var target = style_target(feature);
    var item = style_item();
    var fillColor = (!color) ? getColor(target, item) : color;
    var default_style = {
        fillColor: fillColor,
        weight: 2,
        opacity: 1,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.5
    };

    return merge_styles(default_style, style_override);
};

L.geoJson(districts).addTo(map);

function highlightFeature(e) {
    var layer = e.target;
    //on hover change color from what was defined in function style(feature)
    style_override = {
        weight: 3,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    }
    geojson.resetStyle(e.target);

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

     //on hover change infobox
    info.update(layer.feature.properties);
}


//reset highlight when hovering out
function resetHighlight(e) {
    style_override = {};
    geojson.resetStyle(e.target);
    info.update();
}


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}

var geojson = L.geoJson(districts, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
