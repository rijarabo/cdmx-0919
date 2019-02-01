
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

$(window).on('load',function(){
    $('#StartModalLong').modal('show');
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

// var DamageColorArray 		= ['#FF8C00','#FFD700','#DC143C','#DC143C','#00FFFFFF'];
var CollapseColorArray 	= ['#808080','#808080','#C0C0C0','#C0C0C0','#00FFFFFF'];

// var SeismicArray 		= ['#FF0000','#FFA07A','#006400','#66CDAA','#FFFF00','#00FFFFFF'];
var OpacityArray				= ['0',       '1',      '0.8',    '0.3']
var radiusArray         = [30,         20,       15,       10,       5];
var TotDeathArray       = [30,         20,       10,        5,       1];

// Style for damaged buildings:
//
// const DamagegetColor = function(s) {
//   switch(s) {
//     case 0 :   return {color: DamageColorArray[0], opacity: OpacityArray[2]};
//     case 1 :   return {color: DamageColorArray[1], opacity: OpacityArray[2]};
//     case 2 :   return {color: DamageColorArray[2], opacity: OpacityArray[2]};
//     case 3 :   return {color: DamageColorArray[3], opacity: OpacityArray[2]};
//     case 4 :   return {color: DamageColorArray[4], opacity: OpacityArray[0]};
//   }
// }
//
// function Style(feature) {
//   return {
//     weight: 0,
//     opacity: DamagegetColor(feature.properties.SymbolID).opacity,
//     fillOpacity: DamagegetColor(feature.properties.SymbolID).opacity,
//     fillColor: DamagegetColor(feature.properties.SymbolID).color,
//     radius: 5
//   };
// }

// Style for collapsed buildings:

const getColorCollapse = function(s) {
  switch(s) {
    case 0 :   return {color: CollapseColorArray[0], opacity: OpacityArray[0]};
    case 1 :   return {color: CollapseColorArray[1], opacity: OpacityArray[0]};
    case 2 :   return {color: CollapseColorArray[2], opacity: OpacityArray[2]}; // Only collapsed buildings show
    case 3 :   return {color: CollapseColorArray[3], opacity: OpacityArray[2]}; // Only collapsed buildings show
    case 4 :   return {color: CollapseColorArray[4], opacity: OpacityArray[0]};
  }
}

function CollapseStyle(feature) {
  return {
    weight: 0,
    opacity: getColorCollapse(feature.properties.SymbolID).opacity,
    fillOpacity: getColorCollapse(feature.properties.SymbolID).opacity,
    fillColor: getColorCollapse(feature.properties.SymbolID).color,
    radius: 3
  };
}

function getRadius(victims) {
  return victims = null ? 0:
         victims >TotDeathArray[0] ? radiusArray[0] :
         victims >TotDeathArray[1] ? radiusArray[1] :
         victims >TotDeathArray[2] ? radiusArray[2] :
         victims >TotDeathArray[3] ? radiusArray[3] :
         victims >TotDeathArray[4] ? radiusArray[4] :
              radiusArray[5] ;
}

function victimStyle(feature) {
  return {
    weight: 0,
    opacity: 0.6,
    fillOpacity: 0.6,
    fillColor: '#8B0000',
    radius: getRadius(feature.properties.descriptio)
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

function onEachFeature (feature,layer) {
  var popup=layer.bindPopup(`
    <b style='font-size: 120%'>Number of victims:</b> ${feature.properties.descriptio}<br/>
    <b style='font-size: 120%'>Discrepancy: </b> ${feature.properties.dato_contr}<br/>
    <b style='font-size: 120%'>Location :</b> ${feature.properties.name}
  `)
}

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

// // Damages
// var damages = L.geoJson(atlas, {
//   pointToLayer: function (feature, latlng) {
//     return L.circleMarker(latlng)
//   },
//   style: Style,
//   // onEachFeature: onEachFeature
// })
// // .addTo(map)

// collapsed buildings
var damages = L.geoJson(atlas, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng)
  },
  style: CollapseStyle,
})
.addTo(map)

// Victims
var victims = L.geoJson(fallecidos, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng)
  },
  style: victimStyle,
  onEachFeature: onEachFeature
}).addTo(map)
