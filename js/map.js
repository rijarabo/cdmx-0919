
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

$(window).on('load',function(){
    $('#AboutModalLong').modal('show');
});


// map style

var centerMap =[19.394716,-99.123459]; // MEXICO CITY CENTER
var zoomMap= 11;
var map = L.map('my-map').setView(centerMap, zoomMap);


L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  maxZoom: 19
}).addTo(map);

// Styles

var DamageColorArray 		= ['#FF8C00','#FFD700','#DC143C','#DC143C','#00FFFFFF'];
// var SeismicArray 				= ['#FF0000','#FFA07A','#006400','#66CDAA','#FFFF00','#00FFFFFF'];
var OpacityArray				= ['0','1','0.8','0.3']

const getColor = function(s) {
  switch(s) {
    case 0 :   return {color: DamageColorArray[0], opacity: OpacityArray[2]};
    case 1 :   return {color: DamageColorArray[1], opacity: OpacityArray[2]};
    case 2 :   return {color: DamageColorArray[2], opacity: OpacityArray[2]};
    case 3 :   return {color: DamageColorArray[3], opacity: OpacityArray[2]};
    case 4 :   return {color: DamageColorArray[4], opacity: OpacityArray[0]};
  }
}

// const getSeismic = function(s) {
//   switch(s) {
//     case 0 :   return {color: SeismicArray[0], opacity: OpacityArray[2]};
//     case 1 :   return {color: SeismicArray[1], opacity: OpacityArray[2]};
//     case 2 :   return {color: SeismicArray[2], opacity: OpacityArray[2]};
//     case 3 :   return {color: SeismicArray[3], opacity: OpacityArray[2]};
//     case 4 :   return {color: SeismicArray[4], opacity: OpacityArray[2]};
//     case 5 :   return {color: SeismicArray[5], opacity: OpacityArray[0]};
//   }
// }

const getType = function(s) {
  switch(s) {
    case 0 :   return 'Major Damage';
    case 1 :   return 'Some Damage';
    case 2 :   return 'Collapse';
    case 3 :   return 'Collapse';
    case 4 :   return 'Others';
  }
}

function Style(feature) {
  return {
    weight: 0,
    opacity: getColor(feature.properties.SymbolID).opacity,
    fillOpacity: getColor(feature.properties.SymbolID).opacity,
    fillColor: getColor(feature.properties.SymbolID).color,
    radius: 5
  };
}

// function zoneStyle(feature) {
//   return {
// 		weight: 0,
// 		opacity: OpacityArray[2],
// 		fillOpacity: getSeismic(feature.properties.SymbolID).opacity,
//     fillColor: getSeismic(feature.properties.SymbolID).color,
//   };
// }

// function onEachFeature (feature,layer) {
//   var popup=layer.bindPopup(`
//     <b style='font-size: 120%'> getType(${feature.properties.hour})</b><br/>`)
// }

var mexicostyle = {
									opacity: OpacityArray[1],
									weight: 1,
									dashArray: '5 5',
									color: '#C0C0C0',
									fillOpacity: OpacityArray[0],
}

var lakestyle = {
									opacity: 0,
									color: '#00BFFF',
									fillOpacity: OpacityArray[3],
}


// Mexico City Boundary
var mexicocity = L.geoJson(cdmx, {
  style: mexicostyle
}).addTo(map)

// Lake
var texcocolake = L.geoJson(lake, {
  style: lakestyle
}).addTo(map)

// // zone
// var seismiczoning = L.geoJson(zone, {
//   style: zoneStyle
// })
// // LAYER CONTROL
// var overlay = {
// 	'Lake Texcoco': texcocolake,
// 	'Seismic Zoning': seismiczoning,
// };
//
// L.control.layers(overlay,null,{collapsed:false}).addTo(map);

// Damages
var damages = L.geoJson(atlas, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng)
  },
  style: Style,
  // onEachFeature: onEachFeature
}).addTo(map)
